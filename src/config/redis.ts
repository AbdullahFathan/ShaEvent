import { createClient } from "redis";
import { configApp } from "./config_app";

const redisUrl = `redis://${configApp.redis.host}:${configApp.redis.port}`;

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
