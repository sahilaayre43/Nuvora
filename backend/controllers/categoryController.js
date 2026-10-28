const Category = require("../models/Category");
const Product = require("../models/Product");

const getProductCategoryCount = (nameKey) => Product.countDocuments({
    $expr: {
        $eq: [
            { $toLower: { $trim: { input: { $ifNull: ["$category", ""] } } } },
            nameKey,
        ],
    },
});

const updateProductCategoryName = (currentNameKey, name) => Product.updateMany(
    {
        $expr: {
            $eq: [
                { $toLower: { $trim: { input: { $ifNull: ["$category", ""] } } } },
                currentNameKey,
            ],
        },
    },
    { $set: { category: name } }
);

const getCategories = async (req, res) => {
    try {
        const [categories, productCategories] = await Promise.all([
            Category.find({}).sort({ name: 1 }).lean(),
            Product.aggregate([
                { $group: { _id: "$category", productCount: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);
        const categoriesByKey = new Map(
            categories.map((category) => [
                category.nameKey,
                { _id: category._id, name: category.name, productCount: 0 },
            ])
        );

        for (const productCategory of productCategories) {
            if (typeof productCategory._id !== "string" || !productCategory._id.trim()) {
                continue;
            }

            const nameKey = productCategory._id.trim().toLowerCase();
            const existing = categoriesByKey.get(nameKey);
            if (existing) {
                existing.productCount += productCategory.productCount;
            } else {
                categoriesByKey.set(nameKey, {
                    _id: null,
                    name: productCategory._id.trim(),
                    productCount: productCategory.productCount,
                });
            }
        }

        res.json([...categoriesByKey.values()].sort((first, second) =>
            first.name.localeCompare(second.name)
        ));
    } catch (error) {
        console.error("Could not fetch categories:", error);
        res.status(500).json({ message: "Could not fetch categories." });
    }
};

const createCategory = async (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!name || name.length > 60) {
        return res.status(400).json({ message: "Enter a category name with no more than 60 characters." });
    }

    try {
        const nameKey = name.toLowerCase();
        const existingCategory = await Category.findOne({ nameKey });
        if (existingCategory) {
            return res.status(409).json({ message: "That category already exists." });
        }

        const category = await Category.create({ name, nameKey });
        return res.status(201).json({ ...category.toObject(), productCount: 0 });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "That category already exists." });
        }
        console.error("Could not create category:", error);
        return res.status(500).json({ message: "Could not create category." });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        const productCount = await getProductCategoryCount(category.nameKey);
        if (productCount > 0) {
            return res.status(409).json({
                message: `Reassign the ${productCount} product${productCount === 1 ? "" : "s"} in this category before deleting it.`,
            });
        }

        await category.deleteOne();
        return res.json({ message: "Category deleted." });
    } catch (error) {
        console.error("Could not delete category:", error);
        return res.status(500).json({ message: "Could not delete category." });
    }
};

const updateCategory = async (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!name || name.length > 60) {
        return res.status(400).json({ message: "Enter a category name with no more than 60 characters." });
    }

    const nameKey = name.toLowerCase();

    try {
        const isLegacyCategory = req.params.id === "legacy";
        const category = isLegacyCategory ? null : await Category.findById(req.params.id);
        if (!isLegacyCategory && !category) {
            return res.status(404).json({ message: "Category not found." });
        }

        const currentName = isLegacyCategory
            ? (typeof req.body.currentName === "string" ? req.body.currentName.trim() : "")
            : category.name;
        const currentNameKey = isLegacyCategory ? currentName.toLowerCase() : category.nameKey;
        if (!currentNameKey) {
            return res.status(400).json({ message: "Current category name is required." });
        }

        if (nameKey === currentNameKey) {
            if (!isLegacyCategory) {
                category.name = name;
                await category.save();
                return res.json({
                    _id: category._id,
                    name: category.name,
                    productCount: await getProductCategoryCount(category.nameKey),
                });
            }

            const productCount = await getProductCategoryCount(currentNameKey);
            if (productCount === 0) {
                return res.status(404).json({ message: "Category not found." });
            }
            const managedCategory = await Category.create({ name, nameKey });
            try {
                if (name !== currentName) {
                    await updateProductCategoryName(currentNameKey, name);
                }
            } catch (error) {
                await managedCategory.deleteOne();
                throw error;
            }
            return res.json({
                _id: managedCategory._id,
                name: managedCategory.name,
                productCount,
            });
        }

        const [duplicateCategory, productsInTargetCategory, productCount] = await Promise.all([
            Category.findOne({ nameKey, ...(category ? { _id: { $ne: category._id } } : {}) }),
            getProductCategoryCount(nameKey),
            getProductCategoryCount(currentNameKey),
        ]);
        if (duplicateCategory || productsInTargetCategory > 0) {
            return res.status(409).json({ message: "Another category already uses that name." });
        }
        if (productCount === 0) {
            return res.status(404).json({ message: "Category not found." });
        }

        if (isLegacyCategory) {
            const managedCategory = await Category.create({ name, nameKey });
            try {
                await updateProductCategoryName(currentNameKey, name);
            } catch (error) {
                await managedCategory.deleteOne();
                throw error;
            }
            return res.json({
                _id: managedCategory._id,
                name: managedCategory.name,
                productCount,
            });
        }

        const previousName = category.name;
        const previousNameKey = category.nameKey;
        category.name = name;
        category.nameKey = nameKey;
        await category.save();

        try {
            await updateProductCategoryName(currentNameKey, category.name);
        } catch (error) {
            category.name = previousName;
            category.nameKey = previousNameKey;
            await category.save();
            throw error;
        }

        return res.json({
            _id: category._id,
            name: category.name,
            productCount,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Another category already uses that name." });
        }
        console.error("Could not update category:", error);
        return res.status(500).json({ message: "Could not update category." });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
