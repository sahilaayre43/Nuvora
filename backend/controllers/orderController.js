const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
    try {
        const { items, address, paymentMethod = "COD", paymentId } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }

        const requiredAddressFields = ["fullName", "street", "city", "state", "postalCode", "country"];
        const isAddressValid = address && requiredAddressFields.every(
            (field) => typeof address[field] === "string" && address[field].trim()
        );
        if (!isAddressValid) {
            return res.status(400).json({ message: "Please provide a complete shipping address, including state." });
        }

        if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Please select a valid payment method." });
        }
        if (paymentMethod === "RAZORPAY" && !paymentId) {
            return res.status(400).json({ message: "A verified payment is required for this order." });
        }

        const requestedItems = new Map();
        for (const item of items) {
            if (!item || typeof item !== "object") {
                return res.status(400).json({ message: "One or more cart items are invalid." });
            }
            const productId = item.productId ?? item.id ?? item._id;
            const quantity = Number(item.qty ?? item.quantity);
            if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ message: "One or more cart items are invalid." });
            }
            requestedItems.set(
                String(productId),
                (requestedItems.get(String(productId)) || 0) + quantity
            );
        }

        const products = await Product.find({ _id: { $in: [...requestedItems.keys()] } });
        if (products.length !== requestedItems.size) {
            return res.status(400).json({ message: "One or more products are no longer available." });
        }

        const orderItems = [];
        for (const product of products) {
            const qty = requestedItems.get(String(product._id));
            if (qty > product.stock) {
                return res.status(400).json({
                    message: `${product.name} does not have enough stock for this order.`
                });
            }
            orderItems.push({ productId: product._id, qty, price: product.price });
        }
        const totalAmount = orderItems.reduce((total, item) => total + item.price * item.qty, 0);

        const savedOrder = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            address: Object.fromEntries(
                requiredAddressFields.map((field) => [field, address[field].trim()])
            ),
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
            ...(paymentId ? { paymentId } : {})
        });

        await sendEmail({
            email: req.user.email,
            subject: "Your NUVORA order is confirmed",
            message: `Dear ${req.user.name},<br><br>Thank you for your order! Your order has been successfully placed.<br><br>Order ID: ${savedOrder._id}<br>Total amount: INR ${savedOrder.totalAmount}<br>Payment method: ${savedOrder.paymentMethod}<br>Shipping address: ${requiredAddressFields.map((field) => savedOrder.address[field]).join(", ")}<br><br>We will notify you once your order is shipped.<br><br>NUVORA Team`
        });

        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Order creation failed:", error);
        return res.status(500).json({ message: "Unable to place your order right now." });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
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
