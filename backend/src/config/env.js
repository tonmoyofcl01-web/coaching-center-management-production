import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["DB_USER", "DB_PASSWORD", "DB_CONNECT_STRING"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  DB_USER: process.env.DB_USER,

  DB_PASSWORD: process.env.DB_PASSWORD,

  DB_CONNECT_STRING: process.env.DB_CONNECT_STRING,

  DB_POOL_MIN: Number(process.env.DB_POOL_MIN) || 1,

  DB_POOL_MAX: Number(process.env.DB_POOL_MAX) || 5,

  DB_POOL_INCREMENT: Number(process.env.DB_POOL_INCREMENT) || 1,
};
