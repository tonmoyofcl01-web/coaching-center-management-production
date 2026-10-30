import bcrypt from "bcrypt";
import oracledb from "oracledb";
import { input, password } from "@inquirer/prompts";

import { connectOracle, getConnection, closeOracle } from "../src/db/oracle.js";

async function createTeacher() {
  let connection;

  try {
    console.log("\n--- Create Teacher Account ---\n");

    const fullName = await input({
      message: "Teacher full name:",
      validate: (value) =>
        value.trim().length > 0 && value.trim().length <= 120
          ? true
          : "Name must contain 1–120 characters.",
    });

    const email = await input({
      message: "Teacher email:",
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
        value.trim().length <= 150
          ? true
          : "Please enter a valid email address.",
    });

    const employeeCode = await input({
      message: "Employee code:",
      validate: (value) =>
        value.trim().length > 0 && value.trim().length <= 30
          ? true
          : "Employee code must contain 1–30 characters.",
    });

    const qualification = await input({
      message: "Qualification (optional):",
    });

    const specialization = await input({
      message: "Specialization (optional):",
    });

    const teacherPassword = await password({
      message: "Teacher password:",
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

    if (teacherPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    await connectOracle();
    connection = await getConnection();

    const roleResult = await connection.execute(
      `SELECT ROLE_ID FROM ROLES WHERE ROLE_NAME = 'TEACHER'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (roleResult.rows.length === 0) {
      throw new Error("TEACHER role does not exist.");
    }

    const teacherRoleId = roleResult.rows[0].ROLE_ID;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeCode = employeeCode.trim();

    const existingUser = await connection.execute(
      `SELECT COUNT(*) AS TOTAL FROM USERS WHERE LOWER(EMAIL) = :email`,
      { email: normalizedEmail },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (existingUser.rows[0].TOTAL > 0) {
      throw new Error("An account with this email already exists.");
    }

    const existingTeacher = await connection.execute(
      `SELECT COUNT(*) AS TOTAL FROM TEACHERS WHERE EMPLOYEE_CODE = :employeeCode`,
      { employeeCode: normalizedEmployeeCode },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (existingTeacher.rows[0].TOTAL > 0) {
      throw new Error("This employee code already exists.");
    }

    const passwordHash = await bcrypt.hash(teacherPassword, 12);

    const userResult = await connection.execute(
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
        roleId: teacherRoleId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        userId: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      },
    );

    const userId = userResult.outBinds.userId[0];

    await connection.execute(
      `
        INSERT INTO TEACHERS (
          TEACHER_ID,
          EMPLOYEE_CODE,
          QUALIFICATION,
          SPECIALIZATION,
          EMPLOYMENT_STATUS,
          CREATED_AT
        )
        VALUES (
          :teacherId,
          :employeeCode,
          :qualification,
          :specialization,
          'ACTIVE',
          SYSTIMESTAMP
        )
      `,
      {
        teacherId: userId,
        employeeCode: normalizedEmployeeCode,
        qualification: qualification.trim() || null,
        specialization: specialization.trim() || null,
      },
    );

    await connection.commit();

    console.log("\nTeacher account created successfully.");
    console.log("User ID:", userId);
    console.log("Teacher ID:", userId);
    console.log("Name:", fullName.trim());
    console.log("Email:", normalizedEmail);
    console.log("Employee Code:", normalizedEmployeeCode);
    console.log("Role: TEACHER");
    console.log("Status: ACTIVE");
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }

    await closeOracle();
  }
}

createTeacher().catch((error) => {
  console.error("\nTeacher creation failed:", error.message);
  process.exitCode = 1;
});
