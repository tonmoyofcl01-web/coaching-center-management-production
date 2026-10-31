import oracledb from "oracledb";

import { executeQuery } from "../../utils/executeQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

// Get student dashboard statistics
export const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const studentId = req.user.userId;

  const result = await executeQuery(
    `
        SELECT
          (
            SELECT COUNT(DISTINCT E.BATCH_ID)
            FROM ENROLLMENTS E
            WHERE E.STUDENT_ID = :studentId
              AND E.STATUS = 'ACTIVE'
          ) AS TOTAL_ENROLLED_BATCHES,

          (
            SELECT COUNT(*)
            FROM ATTENDANCE A
            JOIN ENROLLMENTS E
              ON A.ENROLLMENT_ID = E.ENROLLMENT_ID
            WHERE E.STUDENT_ID = :studentId
          ) AS TOTAL_ATTENDANCE_RECORDS,

          (
            SELECT COUNT(*)
            FROM PAYMENTS P
            JOIN ENROLLMENTS E
              ON P.ENROLLMENT_ID = E.ENROLLMENT_ID
            WHERE E.STUDENT_ID = :studentId
          ) AS TOTAL_PAYMENT_TRANSACTIONS

        FROM DUAL
      `,
    { studentId },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const stats = result.rows[0];

  return sendResponse(
    res,
    200,
    "Student dashboard statistics retrieved successfully.",
    {
      totalEnrolledBatches: Number(stats.TOTAL_ENROLLED_BATCHES),
      totalAttendanceRecords: Number(stats.TOTAL_ATTENDANCE_RECORDS),
      totalPaymentTransactions: Number(stats.TOTAL_PAYMENT_TRANSACTIONS),
    },
  );
});

// Get student's enrolled batches
export const getStudentBatches = asyncHandler(async (req, res) => {
  const studentId = req.user.userId;

  const result = await executeQuery(
    `
        SELECT
          B.BATCH_ID,
          B.BATCH_CODE,
          B.BATCH_NAME,
          B.START_DATE,
          B.END_DATE,
          B.STATUS AS BATCH_STATUS,
          E.ENROLLMENT_DATE,
          E.STATUS AS ENROLLMENT_STATUS,
          C.COURSE_NAME,
          U.FULL_NAME AS TEACHER_NAME

        FROM ENROLLMENTS E

        JOIN BATCHES B
          ON E.BATCH_ID = B.BATCH_ID

        JOIN COURSES C
          ON B.COURSE_ID = C.COURSE_ID

        LEFT JOIN TEACHERS T
          ON B.TEACHER_ID = T.TEACHER_ID

        LEFT JOIN USERS U
          ON T.TEACHER_ID = U.USER_ID

        WHERE E.STUDENT_ID = :studentId

        ORDER BY E.ENROLLMENT_DATE DESC
      `,
    { studentId },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const batches = result.rows.map((row) => ({
    id: row.BATCH_ID,
    code: row.BATCH_CODE,
    name: row.BATCH_NAME,
    courseName: row.COURSE_NAME,
    teacherName: row.TEACHER_NAME,
    startDate: row.START_DATE,
    endDate: row.END_DATE,
    batchStatus: row.BATCH_STATUS,
    enrollmentDate: row.ENROLLMENT_DATE,
    enrollmentStatus: row.ENROLLMENT_STATUS,
  }));

  return sendResponse(
    res,
    200,
    "Student batches retrieved successfully.",
    batches,
  );
});

// Get student's weekly class schedule
export const getStudentSchedule = asyncHandler(async (req, res) => {
  const studentId = req.user.userId;

  const result = await executeQuery(
    `
        SELECT
          BS.SCHEDULE_ID,
          BS.DAY_OF_WEEK,
          BS.START_TIME,
          BS.END_TIME,
          BS.ROOM_NAME,
          B.BATCH_NAME,
          B.BATCH_CODE,
          C.COURSE_NAME

        FROM BATCH_SCHEDULES BS

        JOIN BATCHES B
          ON BS.BATCH_ID = B.BATCH_ID

        JOIN COURSES C
          ON B.COURSE_ID = C.COURSE_ID

        JOIN ENROLLMENTS E
          ON E.BATCH_ID = B.BATCH_ID

        WHERE E.STUDENT_ID = :studentId
          AND E.STATUS = 'ACTIVE'
          AND B.STATUS = 'ACTIVE'

        ORDER BY
          CASE BS.DAY_OF_WEEK
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
            ELSE 8
          END,
          BS.START_TIME
      `,
    { studentId },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  const schedule = result.rows.map((row) => ({
    id: row.SCHEDULE_ID,
    day: row.DAY_OF_WEEK,
    startTime: row.START_TIME,
    endTime: row.END_TIME,
    room: row.ROOM_NAME,
    batchName: row.BATCH_NAME,
    batchCode: row.BATCH_CODE,
    courseName: row.COURSE_NAME,
  }));

  return sendResponse(
    res,
    200,
    "Student schedule retrieved successfully.",
    schedule,
  );
});
