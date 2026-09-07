const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, stock, category, } = req.body;
    let imageUrl = '';
    try {
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            stock,
            category
        });
        const savedProduct = await product.save()
        res.status(200).json(savedProduct);
    }
     catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

const updateProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(req.params.id);
    try {
        if(product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock || product.stock;
            product.category = category || product.category;
        if(req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => { 
    const product = await Product.findById(req.params.id);
    try {
        if(product) {
            await product.remove();
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
