const express = require("express");
const { createOrder , getMyOrders } = require("../controllers/orderController");
const { protect , admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const router = express.Router();

// GET ALL ORDERS (ADMIN)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("deliveryBoy", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
// Assign delivery boy
router.put("/assign-delivery/:id", protect, admin, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryBoy = deliveryBoyId;
    order.orderStatus = "out_for_delivery";

    await order.save();

    res.json({ message: "Delivery boy assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get delivery boy orders
router.get("/my-deliveries", protect, async (req, res) => {
  try {
    if (req.user.role !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({
      deliveryBoy: req.user._id,
      orderStatus: { $in: ["out_for_delivery"] },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Mark as delivered
router.put("/mark-delivered/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Security check
    if (order.deliveryBoy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.orderStatus = "delivered";
    order.deliveredAt = new Date();

    await order.save();

    res.json({ message: "Order marked as delivered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
