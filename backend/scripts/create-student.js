import { input, password } from "@inquirer/prompts";
import bcrypt from "bcrypt";
import oracledb from "oracledb";

import { connectOracle, getConnection, closeOracle } from "../src/db/oracle.js";

async function createStudent() {
  let connection;

  try {
    console.log("\n===== CREATE STUDENT ACCOUNT =====\n");

    const fullName = (
      await input({
        message: "Student full name:",
        validate: (value) =>
          value.trim().length > 0 && value.trim().length <= 120
            ? true
            : "Name is required (maximum 120 characters).",
      })
    ).trim();

    const email = (
      await input({
        message: "Student email:",
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
          value.trim().length <= 150
            ? true
            : "Enter a valid email address (maximum 150 characters).",
      })
    )
      .trim()
      .toLowerCase();

    const studentCode = (
      await input({
        message: "Student code:",
        validate: (value) =>
          value.trim().length > 0 && value.trim().length <= 30
            ? true
            : "Student code is required (maximum 30 characters).",
      })
    ).trim();

    const dateOfBirth = (
      await input({
        message: "Date of birth (YYYY-MM-DD, optional):",
        validate: (value) => {
          if (!value.trim()) return true;

          if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
            return "Use YYYY-MM-DD format.";
          }

          const date = new Date(`${value.trim()}T00:00:00`);

          if (
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== value.trim()
          ) {
            return "Enter a valid date.";
          }

          if (date > new Date()) {
            return "Date of birth cannot be in the future.";
          }

          return true;
        },
      })
    ).trim();

    const gender = (
      await input({
        message: "Gender (optional):",
        validate: (value) =>
          value.trim().length <= 30 ? true : "Maximum 30 characters allowed.",
      })
    ).trim();

    const address = (
      await input({
        message: "Address (optional):",
        validate: (value) =>
          value.trim().length <= 300 ? true : "Maximum 300 characters allowed.",
      })
    ).trim();

    const guardianName = (
      await input({
        message: "Guardian name (optional):",
        validate: (value) =>
          value.trim().length <= 120 ? true : "Maximum 120 characters allowed.",
      })
    ).trim();

    const guardianPhone = (
      await input({
        message: "Guardian phone (optional):",
        validate: (value) =>
          value.trim().length <= 20 ? true : "Maximum 20 characters allowed.",
      })
    ).trim();

    const studentPassword = await password({
      message: "Set student password:",
      mask: "*",
      toggleMask: true,
      validate: (value) =>
        value.length >= 8 && value.length <= 128
          ? true
          : "Password must be between 8 and 128 characters.",
    });

    const confirmPassword = await password({
      message: "Confirm student password:",
      mask: "*",
      toggleMask: true,
    });

    if (studentPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    await connectOracle();
    connection = await getConnection();

    const emailCheck = await connection.execute(
      `SELECT COUNT(*) AS TOTAL
       FROM USERS
       WHERE LOWER(EMAIL) = LOWER(:email)`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (Number(emailCheck.rows[0].TOTAL) > 0) {
      throw new Error("This email address is already registered.");
    }

    const codeCheck = await connection.execute(
      `SELECT COUNT(*) AS TOTAL
       FROM STUDENTS
       WHERE STUDENT_CODE = :studentCode`,
      { studentCode },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (Number(codeCheck.rows[0].TOTAL) > 0) {
      throw new Error("This student code is already registered.");
    }

    const roleResult = await connection.execute(
      `SELECT ROLE_ID
       FROM ROLES
       WHERE ROLE_NAME = :roleName`,
      { roleName: "STUDENT" },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (roleResult.rows.length === 0) {
      throw new Error("STUDENT role was not found in the database.");
    }

    const roleId = roleResult.rows[0].ROLE_ID;
    const passwordHash = await bcrypt.hash(studentPassword, 12);

    const userResult = await connection.execute(
      `
        INSERT INTO USERS (
          ROLE_ID,
          FULL_NAME,
          EMAIL,
          PASSWORD_HASH,
          ACCOUNT_STATUS
        )
        VALUES (
          :roleId,
          :fullName,
          :email,
          :passwordHash,
          'ACTIVE'
        )
        RETURNING USER_ID INTO :userId
      `,
      {
        roleId,
        fullName,
        email,
        passwordHash,
        userId: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_OUT,
        },
      },
      { autoCommit: false },
    );

    const studentId = userResult.outBinds.userId[0];

    await connection.execute(
      `
        INSERT INTO STUDENTS (
          STUDENT_ID,
          STUDENT_CODE,
          DATE_OF_BIRTH,
          GENDER,
          ADDRESS,
          GUARDIAN_NAME,
          GUARDIAN_PHONE
        )
        VALUES (
          :studentId,
          :studentCode,
          :dateOfBirth,
          :gender,
          :address,
          :guardianName,
          :guardianPhone
        )
      `,
      {
        studentId,
        studentCode,
        dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00`) : null,
        gender: gender || null,
        address: address || null,
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
      },
      { autoCommit: false },
    );

    await connection.commit();

    console.log("\n===== STUDENT ACCOUNT CREATED =====");
    console.log(`Name: ${fullName}`);
    console.log(`Email: ${email}`);
    console.log(`Student Code: ${studentCode}`);
    console.log(`User ID: ${studentId}`);
    console.log("Role: STUDENT");
    console.log("Account Status: ACTIVE");
    console.log("\nBoth database records were created successfully.");
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("\nStudent account creation failed:");
    console.error(error.message);
  } finally {
    if (connection) {
      await connection.close();
    }

    await closeOracle();
  }
}

createStudent();
