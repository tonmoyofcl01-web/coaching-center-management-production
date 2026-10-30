import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import oracledb from "oracledb";

import { env } from "../../config/env.js";
import { executeQuery } from "../../utils/executeQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { sendResponse } from "../../utils/apiResponse.js";

const COOKIE_NAME = "token";
const TOKEN_EXPIRY = "1d";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  path: "/",
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData.body;

  const result = await executeQuery(
    `
      SELECT
        u.USER_ID,
        u.FULL_NAME,
        u.EMAIL,
        u.PASSWORD_HASH,
        u.ROLE_ID,
        u.ACCOUNT_STATUS,
        r.ROLE_NAME
      FROM USERS u
      JOIN ROLES r
        ON u.ROLE_ID = r.ROLE_ID
      WHERE LOWER(u.EMAIL) = :email
    `,
    { email: email.toLowerCase() },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  if (result.rows.length === 0) {
    throw new AppError("Invalid email or password.", 401);
  }

  const user = result.rows[0];

  const passwordMatches = await bcrypt.compare(password, user.PASSWORD_HASH);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.ACCOUNT_STATUS !== "ACTIVE") {
    throw new AppError(
      "Your account is not active. Please contact the administrator.",
      403,
    );
  }

  const token = jwt.sign(
    {
      sub: String(user.USER_ID),
      role: user.ROLE_NAME,
    },
    env.jwtSecret,
    {
      expiresIn: TOKEN_EXPIRY,
    },
  );

  await executeQuery(
    `
      UPDATE USERS
      SET LAST_LOGIN_AT = SYSTIMESTAMP
      WHERE USER_ID = :userId
    `,
    { userId: user.USER_ID },
  );

  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: COOKIE_MAX_AGE,
  });

  return sendResponse(res, 200, "Login successful.", {
    user: {
      userId: user.USER_ID,
      fullName: user.FULL_NAME,
      email: user.EMAIL,
      roleId: user.ROLE_ID,
      role: user.ROLE_NAME,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return sendResponse(res, 200, "Logout successful.");
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, "User information retrieved successfully.", {
    user: req.user,
  });
});
