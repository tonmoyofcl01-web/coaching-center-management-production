import oracledb from "oracledb";

import { env } from "../config/env.js";

let pool;

export async function connectOracle() {
  if (pool) {
    return pool;
  }

  pool = await oracledb.createPool({
    user: env.DB_USER,

    password: env.DB_PASSWORD,

    connectString: env.DB_CONNECT_STRING,

    poolMin: env.DB_POOL_MIN,

    poolMax: env.DB_POOL_MAX,

    poolIncrement: env.DB_POOL_INCREMENT,
  });

  console.log("Oracle connection pool created.");

  return pool;
}

export async function getConnection() {
  if (!pool) {
    throw new Error("Oracle connection pool has not been initialized.");
  }

  return await pool.getConnection();
}

export async function closeOracle() {
  if (pool) {
    await pool.close(10);

    pool = undefined;

    console.log("Oracle connection pool closed.");
  }
}

export async function checkOracleConnection() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute("SELECT 1 AS STATUS FROM DUAL");

    return result.rows[0][0] === 1;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
