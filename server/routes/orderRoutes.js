import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);
router.put("/:id", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;