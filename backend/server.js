require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {handleWebhook} = require('./controllers/webhookController')
// const rateLimiterMiddleware = require("./middleware/rateLimiter");

// app.use("/api/users", rateLimiterMiddleware, require("./routes/authRoute"));

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
  credentials: true,
}));

// Apply globally
// app.use(rateLimiter);

app.post("/webhook", express.raw({ type: "application/json" }),handleWebhook );

app.use(express.json());

// 👇 VERY IMPORTANT
// app.use("/api/users", userRoutes);
app.use("/api/users", require("./routes/authRoute"));
// const orderRoutes = require("./routes/orderRoute");

// app.use("/api/orders", orderRoutes);

app.use("/api/products", require("./routes/productRoute"));
// app.use('/api/products/postData' , require('./routes/productRoute'));
app.use("/api/cart", require("./routes/cartRoute"));
app.use('/api/orders' ,require('./routes/orderRoute'));
app.use("/api/payment", require("./routes/paymentRoute"));
// app.use('/api/orders' , require());
app.use("/api/reviews", require('./routes/reviewRoute'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
