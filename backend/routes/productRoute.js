const express = require("express");
const cache = require("../middleware/cache");
const router = express.Router();
const { createProduct , getAllProducts ,getSingleProduct , searchProducts} = require("../controllers/productController");
router.post("/", createProduct);
router.get("/search",cache("products"), searchProducts);

router.get('/postData', cache("products") , getAllProducts);
router.get("/:id",cache("products"), getSingleProduct);

module.exports = router;
