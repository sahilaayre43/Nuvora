const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (images) => images.length <= 8,
                message: "A product can have up to 8 images."
            },
        },
        stock:{
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        rating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Product", productSchema);