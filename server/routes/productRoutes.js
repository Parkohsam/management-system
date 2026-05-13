import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all products — any logged in user can view
router.get("/", protect, getProducts);

// GET single product
router.get("/:id", protect, getProductById);

// POST create product — admin only
router.post("/", protect, adminOnly, createProduct);

// PUT update product — admin only
router.put("/:id", protect, adminOnly, updateProduct);

// DELETE product — admin only
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;