const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");
const MAX_PRODUCT_IMAGES = 8;

const getUploadedImageFiles = (req) => [
    ...(req.files?.images || []),
    ...(req.files?.image || []),
];

const uploadImages = async (files) => Promise.all(
    files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'nuvora/products',
        });
        return result.secure_url;
    })
);

const findCategoryName = async (value) => {
    if (typeof value !== "string" || !value.trim() || value.trim().length > 60) {
        return null;
    }

    const name = value.trim();
    const category = await Category.findOne({ nameKey: name.toLowerCase() });
    if (category) {
        return category.name;
    }

    const existingProduct = await Product.findOne({
        $expr: {
            $eq: [
                { $toLower: { $trim: { input: { $ifNull: ["$category", ""] } } } },
                name.toLowerCase(),
            ],
        },
    }).select("category").lean();
    return existingProduct?.category?.trim() || null;
};

const getRatingStats = (reviews) => ({
    rating: reviews.length
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : 0,
    numReviews: reviews.length,
});

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        const reviewStats = await Review.aggregate([
            { $group: { _id: "$productId", rating: { $avg: "$rating" }, numReviews: { $sum: 1 } } },
        ]);
        const statsByProduct = new Map(reviewStats.map((stats) => [String(stats._id), stats]));

        res.json(products.map((product) => {
            const stats = statsByProduct.get(String(product._id));
            return {
                ...product.toObject(),
                rating: stats ? Number(stats.rating.toFixed(1)) : 0,
                numReviews: stats?.numReviews || 0,
            };
        }));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 }).lean();
            res.json({ ...product.toObject(), ...getRatingStats(reviews), reviews });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createReview = async (req, res) => {
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5.' });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Review.findOneAndUpdate(
            { productId: product._id, userId: req.user._id },
            {
                $set: {
                    name: req.user.name,
                    rating,
                    comment: String(req.body.comment || '').trim(),
                },
            },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 }).lean();
        const stats = getRatingStats(reviews);
        await Product.findByIdAndUpdate(product._id, stats);

        res.json({ ...stats, reviews });
    } catch (error) {
        res.status(500).json({ message: 'Could not save your rating.' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const imageFiles = getUploadedImageFiles(req);

    if (imageFiles.length === 0) {
        return res.status(400).json({ message: 'At least one product image is required.' });
    }
    if (imageFiles.length > MAX_PRODUCT_IMAGES) {
        return res.status(400).json({ message: `A product can have up to ${MAX_PRODUCT_IMAGES} images.` });
    }

    try {
        const categoryName = await findCategoryName(category);
        if (!categoryName) {
            return res.status(400).json({ message: 'Select an existing product category.' });
        }

        const imageUrls = await uploadImages(imageFiles);

        const product = new Product({
            name,
            description,
            price,
            stock,
            category: categoryName,
            imageUrl: imageUrls[0],
            images: imageUrls,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const imageFiles = getUploadedImageFiles(req);

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryName = category ? await findCategoryName(category) : product.category;
        if (!categoryName) {
            return res.status(400).json({ message: 'Select an existing product category.' });
        }

        const existingImages = product.images?.length
            ? product.images
            : product.imageUrl ? [product.imageUrl] : [];
        const isLegacySingleImageUpload = Boolean(req.files?.image?.length);
        const resultingImageCount = isLegacySingleImageUpload
            ? Math.max(existingImages.length, 1)
            : existingImages.length + imageFiles.length;
        if (resultingImageCount > MAX_PRODUCT_IMAGES) {
            return res.status(400).json({
                message: `A product can have up to ${MAX_PRODUCT_IMAGES} images. Remove or select fewer images.`,
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = categoryName;

        if (imageFiles.length > 0) {
            const imageUrls = await uploadImages(imageFiles);
            product.images = isLegacySingleImageUpload
                ? [imageUrls[0], ...existingImages.slice(1)]
                : [...existingImages, ...imageUrls];
            product.imageUrl = product.images[0];
        } else if (!product.images?.length && product.imageUrl) {
            product.images = [product.imageUrl];
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(product) {
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createReview, createProduct, updateProduct, deleteProduct };
