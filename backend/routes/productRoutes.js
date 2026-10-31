const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getProducts, getProductById, createReview, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
    dest: uploadDir,
    limits: { files: 8, fileSize: 10 * 1024 * 1024 },
});
const cleanupTemporaryUploads = (files) => {
    Object.values(files || {}).flat().forEach((file) => {
        fs.unlink(file.path, (error) => {
            if (error && error.code !== "ENOENT") {
                console.error("Could not remove temporary product image:", error);
            }
        });
    });
};
const uploadProductImages = (req, res, next) => {
    upload.fields([
        { name: "images", maxCount: 8 },
        { name: "image", maxCount: 1 },
    ])(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            cleanupTemporaryUploads(req.files);
            return res.status(400).json({
                message: error.code === "LIMIT_FILE_SIZE"
                    ? "Each product image must be 10 MB or smaller."
                    : "A product can have up to 8 images.",
            });
        }
        if (error) return next(error);
        res.once("finish", () => cleanupTemporaryUploads(req.files));
        next();
    });
};

router.route("/").get(getProducts).post(protect, admin, uploadProductImages, createProduct);
router.post("/:id/reviews", protect, createReview);
router.route("/:id").get(getProductById).put(protect, admin, uploadProductImages, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
