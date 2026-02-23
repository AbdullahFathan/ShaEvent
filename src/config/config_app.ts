export const configApp = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5321,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "postgres",
    url: process.env.DATABASE_URL || "",
  },
  redis: {
    port: process.env.REDIS_PORT || 6989,
    host: process.env.REDIS_HOST || "localhost",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || 1,
  },
};

console.log("Config loaded:", configApp.jwt);
