const order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
     try {
        const { userId, products, totalAmount, shippingAddress } = req.body;
        if (!userId || !products || !totalAmount || !shippingAddress) {
            return res.status(400).json({ message: "Invalid order data. All fields are required" });
        }
        const newOrder = new order({
            user: req.user._id,
            items,
            totalAmount,
            address
        });
        const savedOrder = await newOrder.save();

        const message = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully placed.\n\nOrder Details:\nOrder ID: ${savedOrder._id}\nTotal Amount: $${savedOrder.totalAmount}\nShipping Address: ${savedOrder.address.fullName}, ${savedOrder.address.street}, ${savedOrder.address.city}, ${savedOrder.address.state}, ${savedOrder.address.postalCode}, ${savedOrder.address.country}\n\nWe will notify you once your order is shipped.\n\nThank you for shopping with us!\n\nBest regards,\nNUVORA Team`;

        await sendEmail(savedOrder.user.email, message);
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await order.find({ user: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await order.find({}).populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};