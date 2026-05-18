const express = require("express");
const { syncUser ,addAddress , deleteAddress } = require("../controllers/authController");
const { protect , admin } = require("../middleware/authMiddleware");
const User = require('../models/User')
const router = express.Router();
const rateLimiterMiddleware = require("../middleware/rateLimiter");


router.post("/sync", syncUser);
router.delete("/address/:id", protect, deleteAddress);



router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
router.post("/address", protect, addAddress);

router.put("/request-seller", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Already seller or admin" });
    }

    req.user.sellerRequest = "pending";
    await req.user.save();

    res.json({ message: "Seller request submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/seller-requests", protect, admin, async (req, res) => {
  const users = await User.find({ sellerRequest: "pending" });
  res.json(users);
});

router.put("/approve-seller/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "seller";
    user.sellerRequest = "approved";

    await user.save();

    res.json({ message: "User promoted to seller" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/reject-seller/:id", protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);

  user.sellerRequest = "rejected";
  await user.save();

  res.json({ message: "Seller request rejected" });
});


router.put("/request-delivery", protect, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Already seller/admin/deliveryBoy" });
    }

    req.user.deliveryRequest = "pending";
    await req.user.save();

    res.json({ message: "Delivery role request submitted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/delivery-requests", protect, admin, async (req, res) => {
  const users = await User.find({ deliveryRequest: "pending" });
  res.json(users);
});

router.put("/approve-delivery/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "deliveryBoy";
    user.deliveryRequest = "approved";

    await user.save();

    res.json({ message: "User promoted to Delivery Boy" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get all delivery boys
router.get("/delivery-boys", protect, admin, async (req, res) => {
  const boys = await User.find({ role: "deliveryBoy" });
  res.json(boys);
});


module.exports = router;
