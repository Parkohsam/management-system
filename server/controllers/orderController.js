import Order from "../models/Order.js";
import Product from "../models/Product.js";

// CREATE Order
export const createOrder = async (req, res) => {
    try {
        const { customer, items, note } = req.body;

        if (!customer || !items || items.length === 0) {
            return res
                .status(400)
                .json({ message: "Customer and items are required" });
        }

        // Loop through items, verify each product exists and has enough stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res
                    .status(404)
                    .json({ message: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
                });
            }

            // Calculate item total and add to order
            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name, // Save name in case product is deleted later
                price: product.price, // Save price at time of order
                quantity: item.quantity,
            });

            // Reduce stock for each item ordered
            await Product.findByIdAndUpdate(product._id, {
                $inc: { stock: -item.quantity },
                // $inc means increment — negative number reduces stock
            });
        }

        // Create the order
        const order = await Order.create({
            customer,
            items: orderItems,
            totalAmount,
            note,
            createdBy: req.user._id, // Who created this order (from JWT)
        });

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET ALL Orders 
export const getOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate("createdBy", "name email")
            // .populate() replaces the ID with actual user data
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SINGLE Order 
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "createdBy",
            "name email",
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  UPDATE Order Status 
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["pending","processing","shipped","delivered", "cancelled",];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true },
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated",
            order,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE Order 
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
