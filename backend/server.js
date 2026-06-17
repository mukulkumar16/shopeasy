require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {handleWebhook} = require('./controllers/webhookController')


connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
  credentials: true,
}));



app.post("/webhook", express.raw({ type: "application/json" }),handleWebhook );

app.use(express.json());


app.use("/api/users", require("./routes/authRoute"));


app.use("/api/products", require("./routes/productRoute"));

app.use("/api/cart", require("./routes/cartRoute"));
app.use('/api/orders' ,require('./routes/orderRoute'));
app.use("/api/payment", require("./routes/paymentRoute"));

app.use("/api/reviews", require('./routes/reviewRoute'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
