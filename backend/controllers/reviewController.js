const Review = require('../models/Review');
// const Product = require("../models/Product");

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json(review);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};