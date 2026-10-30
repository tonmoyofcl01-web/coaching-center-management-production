import oracledb from "oracledb";

import { env } from "../config/env.js";

let pool;
let poolPromise;

// Create the Oracle connection pool.
export async function connectOracle() {
  if (pool) {
    return pool;
  }

  // Prevent multiple pools from being created simultaneously.
  if (!poolPromise) {
    poolPromise = oracledb.createPool({
      user: env.db.user,
      password: env.db.password,
      connectString: env.db.connectString,

      poolMin: env.db.poolMin,
      poolMax: env.db.poolMax,
      poolIncrement: env.db.poolIncrement,
    });
  }

  try {
    pool = await poolPromise;

    console.log("Oracle connection pool created.");

    return pool;
  } finally {
    poolPromise = undefined;
  }
}

// Get a connection from the pool.
export async function getConnection() {
  if (!pool) {
    throw new Error("Oracle connection pool has not been initialized.");
  }

  return await pool.getConnection();
}

// Close the Oracle connection pool.
export async function closeOracle() {
  if (pool) {
    await pool.close(10);

    pool = undefined;

    console.log("Oracle connection pool closed.");
  }
}

// Test the Oracle database connection.
export async function checkOracleConnection() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      "SELECT 1 AS STATUS FROM DUAL",
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    return result.rows[0].STATUS === 1;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
