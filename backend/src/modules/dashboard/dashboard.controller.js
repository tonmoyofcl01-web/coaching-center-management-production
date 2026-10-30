import oracledb from "oracledb";

import { executeQuery } from "../../utils/executeQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `
      SELECT
        (SELECT COUNT(*) FROM STUDENTS) AS TOTAL_STUDENTS,
        (SELECT COUNT(*) FROM TEACHERS) AS TOTAL_TEACHERS,
        (SELECT COUNT(*) FROM COURSES) AS TOTAL_COURSES,
        (
          SELECT NVL(SUM(AMOUNT), 0)
          FROM PAYMENTS
          WHERE STATUS = 'COMPLETED'
        ) AS TOTAL_REVENUE
      FROM DUAL
    `,
    {},
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const stats = result.rows[0];

  return sendResponse(
    res,
    200,
    "Dashboard statistics retrieved successfully.",
    {
      totalStudents: stats.TOTAL_STUDENTS,
      totalTeachers: stats.TOTAL_TEACHERS,
      totalCourses: stats.TOTAL_COURSES,
      totalRevenue: stats.TOTAL_REVENUE,
    },
  );
});

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `
      WITH MONTHS AS (
        SELECT
          ADD_MONTHS(TRUNC(SYSDATE, 'MM'), 1 - LEVEL) AS MONTH_START
        FROM DUAL
        CONNECT BY LEVEL <= 6
      ),
      MONTHLY_REVENUE AS (
        SELECT
          TRUNC(PAYMENT_DATE, 'MM') AS MONTH_START,
          SUM(AMOUNT) AS TOTAL_REVENUE
        FROM PAYMENTS
        WHERE
          STATUS = 'COMPLETED'
          AND PAYMENT_DATE >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -5)
          AND PAYMENT_DATE < ADD_MONTHS(TRUNC(SYSDATE, 'MM'), 1)
        GROUP BY TRUNC(PAYMENT_DATE, 'MM')
      )
      SELECT
        TO_CHAR(M.MONTH_START, 'Mon YYYY') AS MONTH,
        NVL(MR.TOTAL_REVENUE, 0) AS REVENUE
      FROM MONTHS M
      LEFT JOIN MONTHLY_REVENUE MR
        ON M.MONTH_START = MR.MONTH_START
      ORDER BY M.MONTH_START
    `,
    {},
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const revenue = result.rows.map((row) => ({
    month: row.MONTH,
    revenue: Number(row.REVENUE),
  }));

  return sendResponse(
    res,
    200,
    "Monthly revenue retrieved successfully.",
    revenue,
  );
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `
      SELECT
        AL.LOG_ID,
        AL.ACTION,
        AL.ENTITY_TYPE,
        AL.ENTITY_ID,
        DBMS_LOB.SUBSTR(AL.DETAILS, 1000, 1) AS DETAILS,
        TO_CHAR(
          AL.CREATED_AT,
          'YYYY-MM-DD"T"HH24:MI:SS'
        ) AS CREATED_AT,
        U.FULL_NAME AS USER_NAME
      FROM AUDIT_LOGS AL
      LEFT JOIN USERS U
        ON AL.USER_ID = U.USER_ID
      ORDER BY AL.CREATED_AT DESC
      FETCH FIRST 5 ROWS ONLY
    `,
    {},
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const activities = result.rows.map((row) => ({
    id: row.LOG_ID,
    action: row.ACTION,
    entityType: row.ENTITY_TYPE,
    entityId: row.ENTITY_ID,
    details: row.DETAILS,
    userName: row.USER_NAME || "Unknown User",
    createdAt: row.CREATED_AT,
  }));

  return sendResponse(
    res,
    200,
    "Recent activities retrieved successfully.",
    activities,
  );
});

export const getEnrollmentSummary = asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `
      SELECT
        NVL(STATUS, 'UNKNOWN') AS STATUS,
        COUNT(*) AS TOTAL_COUNT,
        SUM(COUNT(*)) OVER () AS TOTAL_ENROLLMENTS
      FROM ENROLLMENTS
      GROUP BY NVL(STATUS, 'UNKNOWN')
      ORDER BY STATUS
    `,
    {},
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const enrollmentSummary = {
    totalEnrollments:
      result.rows.length > 0 ? Number(result.rows[0].TOTAL_ENROLLMENTS) : 0,

    statusBreakdown: result.rows.map((row) => ({
      status: row.STATUS,
      count: Number(row.TOTAL_COUNT),
    })),
  };

  return sendResponse(
    res,
    200,
    "Enrollment summary retrieved successfully.",
    enrollmentSummary,
  );
});
