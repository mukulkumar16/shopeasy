const redisClient = require("../config/redisClient");
const Product = require("../models/Product");
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      price,
      stock,
      image,
      ratingsAverage,
      seller
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    const product = await Product.create({
      title,
      description,
      brand,
      price,
      stock,
      image,
      ratingsAverage,
      seller,
    });

    // 🔥 Clear related caches
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    const searchKeys = await redisClient.keys("search:*");
    if (searchKeys.length > 0) {
      await redisClient.del(searchKeys);
    }

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const cacheKey = "products:all";

    // 🔹 Check Redis first
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("⚡ Products from Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // 🔹 If not in cache → fetch from DB
    const products = await Product.find();

    // 🔹 Store in Redis (TTL = 60 sec)
    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 60,
    });

    console.log("📦 Products from DB");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const cacheKey = `product:${productId}`;

    // 🔹 Check cache
    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log("⚡ Single product from Redis");
      return res.json(JSON.parse(cachedProduct));
    }

    // 🔹 Fetch from DB
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Store in Redis
    await redisClient.set(cacheKey, JSON.stringify(product), {
      EX: 60,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const cacheKey = `search:${q}`;

    // 🔹 Check cache
    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      console.log("⚡ Search from Redis");
      return res.json(JSON.parse(cachedResults));
    }

    // 🔹 Fetch from DB
    const products = await Product.find({
      title: { $regex: q, $options: "i" },
    });

    // 🔹 Store in Redis
    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 60,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};