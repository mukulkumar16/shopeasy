const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

exports.createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    // 1️⃣ Get user
    const user = await User.findById(req.user._id);

    // 2️⃣ Check address
    const selectedAddress = user.addresses.id(addressId);

    if (!selectedAddress) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // 3️⃣ Get cart
    const cart = await Cart.findOne({ user: user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 4️⃣ Create order
    const order = await Order.create({
      user: user._id,
      items: cart.items,
      shippingAddress: selectedAddress,
      totalAmount: cart.totalPrice,
    });

    // 5️⃣ Clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getMyOrders = async (req, res) => {
  try {
    const clerkId = req.auth.userId; // from Clerk middleware

    // Find user in DB using clerkId
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find orders created by this user
    const orders = await Order.find({ user: user._id })
      .populate("items.product", "title image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};