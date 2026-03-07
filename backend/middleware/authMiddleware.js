const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

exports.protect = [
  ClerkExpressRequireAuth(), // verifies Clerk token
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId; // 👈 THIS is the real user id

      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({ message: "User not found in DB" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
];

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin only" });
  }
};
