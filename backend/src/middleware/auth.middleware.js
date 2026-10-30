import jwt from "jsonwebtoken";
import oracledb from "oracledb";

import { env } from "../config/env.js";
import { executeQuery } from "../utils/executeQuery.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError("Invalid or expired session. Please log in again.", 401);
  }

  const userId = Number(decoded.sub);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AppError("Invalid authentication token.", 401);
  }

  const result = await executeQuery(
    `
      SELECT
        u.USER_ID,
        u.FULL_NAME,
        u.EMAIL,
        u.ROLE_ID,
        u.ACCOUNT_STATUS,
        r.ROLE_NAME
      FROM USERS u
      JOIN ROLES r
        ON u.ROLE_ID = r.ROLE_ID
      WHERE u.USER_ID = :userId
        AND u.ACCOUNT_STATUS = 'ACTIVE'
    `,
    { userId },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  if (result.rows.length === 0) {
    throw new AppError("Your session is no longer valid.", 401);
  }

  const user = result.rows[0];

  req.user = {
    userId: user.USER_ID,
    fullName: user.FULL_NAME,
    email: user.EMAIL,
    roleId: user.ROLE_ID,
    role: user.ROLE_NAME,
  };

  next();
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to access this resource.",
          403,
        ),
      );
    }

    next();
  };
};
