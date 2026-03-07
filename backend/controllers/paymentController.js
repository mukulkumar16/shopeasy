const stripe = require("../config/stripe");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require('../models/Product')

exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const userId = session.metadata.userId;
    const addressId = session.metadata.addressId;

    const user = await User.findById(userId);
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Get selected address
    const selectedAddress = user.addresses.id(addressId);

    if (!selectedAddress) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // ✅ Prevent duplicate order creation
    const existingOrder = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (existingOrder) {
      return res.json({ message: "Order already created" });
    }

    // ✅ Create Order
    await Order.create({
      user: userId,
      items: cart.items,
      shippingAddress: selectedAddress,
      totalAmount: session.amount_total / 100,

      paymentInfo: {
        method: "card",
        paymentId: session.payment_intent,
        status: "paid",
      },

      orderStatus: "processing",
      stripeSessionId: sessionId,
    });

    // ✅ Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: "Order created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createCheckoutSession = async (req, res) => {
  try {
    const { addressId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: cart.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.title,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,

      metadata: {
        userId: req.user._id.toString(),
        addressId: addressId,
      },
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.buyNow = async (req, res) => {
  try {
    const { productId, quantity , addressId } = req.body;

    // 1️⃣ Validate input
    if (!productId || !addressId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Get product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3️⃣ Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // 4️⃣ Get user + address
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(400).json({ message: "Address not found" });
    }

    // 5️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title,
              images: [product.image],
            },
            unit_amount: product.price * 100, // Stripe needs paise
          },
          quantity: quantity || 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,

      metadata: {
        userId: user._id.toString(),
        productId: product._id.toString(),
        quantity: quantity.toString(),
        addressId: addressId.toString(),
        type: "buy-now",
      },
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Buy Now Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};