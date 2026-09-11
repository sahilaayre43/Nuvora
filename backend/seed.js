const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const MONGO_URI =
  process.env.MONGODB_URL ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/nuvora";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const password = await bcrypt.hash("password123", 10);

    let admin = await User.findOne({ email: "admin@nuvora.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@nuvora.com",
        password,
        role: "admin",
        verified: true
      });
    }

    let user = await User.findOne({ email: "john@example.com" });
    if (!user) {
      user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password,
        role: "user",
        verified: true
      });
    }

    const productData = [
      {
        name: "Classic White T-Shirt",
        price: 799,
        description: "Comfortable cotton t-shirt for everyday wear.",
        imageUrl: "https://via.placeholder.com/500x500?text=White+T-Shirt",
        stock: 50,
        category: "Clothing",
        rating: 4.5,
        numReviews: 12
      },
      {
        name: "Wireless Headphones",
        price: 2499,
        description: "High-quality wireless headphones with clear sound.",
        imageUrl: "https://via.placeholder.com/500x500?text=Headphones",
        stock: 25,
        category: "Electronics",
        rating: 4.7,
        numReviews: 28
      },
      {
        name: "Leather Backpack",
        price: 1899,
        description: "Stylish and durable backpack for work and travel.",
        imageUrl: "https://via.placeholder.com/500x500?text=Backpack",
        stock: 15,
        category: "Accessories",
        rating: 4.3,
        numReviews: 9
      }
    ];

    const products = [];
    for (const data of productData) {
      let product = await Product.findOne({ name: data.name });
      if (!product) {
        product = await Product.create(data);
      }
      products.push(product);
    }

    const product = products[0];
    const existingOrder = await Order.findOne({ paymentId: "demo_payment_001" });
    if (!existingOrder) {
      await Order.create({
        user: user._id,
        items: [
          {
            productId: product._id,
            qty: 2,
            price: product.price
          }
        ],
        totalAmount: product.price * 2,
        address: {
          fullName: "John Doe",
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India"
        },
        paymentId: "demo_payment_001",
        status: "delivered"
      });
    }

    console.log("Dummy data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();