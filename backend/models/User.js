const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false 
    },
    authTokenVersion: {
        type: Number,
        default: 0
    },
    verificationTokenHash: {
        type: String,
        default: null
    },
    verificationTokenExpires: {
        type: Date,
        default: null
    },
    passwordResetTokenHash: {
        type: String,
        default: null
    },
    passwordResetTokenExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);