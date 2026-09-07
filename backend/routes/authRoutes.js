const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, admin, getUser);
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;    
    try {
        const user = await User.findOne({ email });
        if (user) {
            if (user.otp === otp) {
                user.otp = null;
                await user.save();
                res.status(200).json({ message: 'OTP verified successfully!' });
            } else {
                res.status(400).json({ message: 'Invalid OTP!' });
            }
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
