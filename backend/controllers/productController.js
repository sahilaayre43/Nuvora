const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");

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

    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required.' });
    }

    try {
        const categoryName = await findCategoryName(category);
        if (!categoryName) {
            return res.status(400).json({ message: 'Select an existing product category.' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'nuvora/products',
        });

        const product = new Product({
            name,
            description,
            price,
            stock,
            category: categoryName,
            imageUrl: result.secure_url,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryName = category ? await findCategoryName(category) : product.category;
        if (!categoryName) {
            return res.status(400).json({ message: 'Select an existing product category.' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = categoryName;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'nuvora/products',
            });
            product.imageUrl = result.secure_url;
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
