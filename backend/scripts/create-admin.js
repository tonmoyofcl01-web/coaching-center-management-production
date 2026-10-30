import bcrypt from "bcrypt";
import oracledb from "oracledb";
import { input, password } from "@inquirer/prompts";

import { connectOracle, closeOracle } from "../src/db/oracle.js";
import { executeQuery } from "../src/utils/executeQuery.js";

async function createAdmin() {
  try {
    console.log("\n--- Create Initial Admin Account ---\n");

    const fullName = await input({
      message: "Admin full name:",
      validate: (value) =>
        value.trim().length > 0 && value.trim().length <= 120
          ? true
          : "Name must contain 1–120 characters.",
    });

    const email = await input({
      message: "Admin email:",
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
        value.trim().length <= 150
          ? true
          : "Please enter a valid email address.",
    });

    const adminPassword = await password({
      message: "Admin password:",
      mask: "*",
      validate: (value) =>
        value.length >= 12 && value.length <= 128
          ? true
          : "Password must contain 12–128 characters.",
    });

    const confirmPassword = await password({
      message: "Confirm password:",
      mask: "*",
    });

    if (adminPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    await connectOracle();

    const roleResult = await executeQuery(
      `SELECT ROLE_ID FROM ROLES WHERE ROLE_NAME = 'ADMIN'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (roleResult.rows.length === 0) {
      throw new Error("ADMIN role does not exist.");
    }

    const adminRoleId = roleResult.rows[0].ROLE_ID;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await executeQuery(
      `SELECT COUNT(*) AS TOTAL FROM USERS WHERE LOWER(EMAIL) = :email`,
      { email: normalizedEmail },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (existingUser.rows[0].TOTAL > 0) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const result = await executeQuery(
      `
        INSERT INTO USERS (
          ROLE_ID,
          FULL_NAME,
          EMAIL,
          PASSWORD_HASH,
          ACCOUNT_STATUS,
          CREATED_AT
        )
        VALUES (
          :roleId,
          :fullName,
          :email,
          :passwordHash,
          'ACTIVE',
          SYSTIMESTAMP
        )
        RETURNING USER_ID INTO :userId
      `,
      {
        roleId: adminRoleId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        userId: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      },
    );

    console.log("\nAdmin account created successfully.");
    console.log("User ID:", result.outBinds.userId[0]);
    console.log("Name:", fullName.trim());
    console.log("Email:", normalizedEmail);
    console.log("Role: ADMIN");
    console.log("Status: ACTIVE");
  } finally {
    await closeOracle();
  }
}

createAdmin().catch((error) => {
  console.error("\nAdmin creation failed:", error.message);
  process.exitCode = 1;
});
