const express = require("express");
const router = express.Router();
const { createProduct , getAllProducts ,getSingleProduct , searchProducts} = require("../controllers/productController");
router.post("/", createProduct);
router.get("/search", searchProducts);
router.get('/postData' , getAllProducts);
router.get("/:id", getSingleProduct);

module.exports = router;
