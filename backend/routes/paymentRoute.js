const express = require("express");
const router = express.Router();
const { verifySession , createCheckoutSession , buyNow } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/verify-session", protect, verifySession);
router.post(
  "/create-checkout-session",
  protect,
  createCheckoutSession
);

// routes/payment.js
router.post("/buy-now", protect, buyNow);

module.exports = router;

