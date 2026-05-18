const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../config/redisClient");

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 200,
  duration: 60,
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip;

    await rateLimiter.consume(ip);

    next();
  } catch (rejRes) {
    const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);

    res.set("Retry-After", String(retryAfter));

    return res.status(429).json({
      message: "Too many requests",
      retryAfter,
    });
  }
};

module.exports = rateLimiterMiddleware;