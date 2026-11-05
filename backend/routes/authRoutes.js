const express = require("express");
const router = express.Router();
const {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    requestPasswordReset,
    resetPassword,
    getUsers
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/users", protect, admin, getUsers);

module.exports = router;
