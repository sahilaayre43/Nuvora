const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/")
    .get(getCategories)
    .post(protect, admin, createCategory);
router.put("/legacy", protect, admin, updateCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
