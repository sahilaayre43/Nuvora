const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        const orders = await Order.find({});

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            orders
        });
    } catch (error) {
        res.status(500).json({message: 'Error fetching status', error });
    }
};

module.exports = { getAdminStats }