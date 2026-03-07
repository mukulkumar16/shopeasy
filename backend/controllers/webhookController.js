const Stripe = require("stripe");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature failed");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Payment successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const addressId = session.metadata.addressId;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    const user = await User.findById(userId);

    if (!cart) return;

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.image,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address: user.addresses.id(addressId),
      paymentInfo: {
        id: session.payment_intent,
        status: "paid",
      },
      orderStatus: "processing",
    });

    // 🧹 Clear cart
    cart.items = [];
    await cart.save();
  }

  res.json({ received: true });
};