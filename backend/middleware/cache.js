const redisClient = require("../config/redisClient");

const cacheMiddleware = (keyPrefix) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("⚡ Serving from cache");
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to store data in Redis
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        await redisClient.set(key, JSON.stringify(data), {
          EX: 60, // cache for 60 seconds
        });

        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error("Cache error:", err);
      next();
    }
  };
};

module.exports = cacheMiddleware;