const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,
    brand: String,
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);

// 🔥 Text search index
productSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
