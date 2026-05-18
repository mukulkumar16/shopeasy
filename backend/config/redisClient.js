const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "rediss://default:gQAAAAAAAW1qAAIgcDFiMzk3N2I3NmFjZWM0M2IyYTBjOWZiYWM3NTE1MWU3OQ@artistic-bee-93546.upstash.io:6379",
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;