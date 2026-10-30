import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load the backend .env file.
dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
});

// Check required environment variables.
const requiredVariables = ["DB_USER", "DB_PASSWORD", "DB_CONNECT_STRING"];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable],
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingVariables.join(", ")}`,
  );
}

// Convert environment values into valid positive integers.
const getPositiveInteger = (name, defaultValue) => {
  const value = Number(process.env[name] ?? defaultValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return value;
};

const port = getPositiveInteger("PORT", 5000);

const poolMin = getPositiveInteger("DB_POOL_MIN", 1);
const poolMax = getPositiveInteger("DB_POOL_MAX", 5);
const poolIncrement = getPositiveInteger("DB_POOL_INCREMENT", 1);

if (poolMax < poolMin) {
  throw new Error("DB_POOL_MAX cannot be smaller than DB_POOL_MIN.");
}

// Export centralized application configuration.
export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",

  port,

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  db: Object.freeze({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,

    poolMin,
    poolMax,
    poolIncrement,
  }),
});
