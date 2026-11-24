const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    verificationTokenHash: {
        type: String,
        required: true
    },
    verificationAttempts: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
