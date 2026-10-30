import { getConnection } from "../db/oracle.js";

// Execute an Oracle database query.
export async function executeQuery(sql, binds = [], options = {}) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(sql, binds, {
      autoCommit: true,
      ...options,
    });

    return result;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
