import oracledb from "oracledb";

import { executeQuery } from "../../utils/executeQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

export const getTeacherDashboardStats = asyncHandler(async (req, res) => {
  const teacherId = req.user.userId;

  const result = await executeQuery(
    `
      SELECT
        (SELECT COUNT(*)
         FROM BATCHES
         WHERE TEACHER_ID = :teacherId) AS TOTAL_BATCHES,

        (SELECT COUNT(DISTINCT E.STUDENT_ID)
         FROM ENROLLMENTS E
         JOIN BATCHES B ON E.BATCH_ID = B.BATCH_ID
         WHERE B.TEACHER_ID = :teacherId
           AND E.STATUS = 'ACTIVE') AS TOTAL_STUDENTS,

        (SELECT COUNT(*)
         FROM BATCHES
         WHERE TEACHER_ID = :teacherId
           AND STATUS = 'ACTIVE') AS ACTIVE_BATCHES

      FROM DUAL
    `,
    { teacherId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const stats = result.rows[0];

  return sendResponse(
    res,
    200,
    "Teacher dashboard statistics retrieved successfully.",
    {
      totalBatches: Number(stats.TOTAL_BATCHES),
      totalStudents: Number(stats.TOTAL_STUDENTS),
      activeBatches: Number(stats.ACTIVE_BATCHES),
    },
  );
});

export const getTeacherBatches = asyncHandler(async (req, res) => {
  const teacherId = req.user.userId;

  const result = await executeQuery(
    `
      SELECT
        B.BATCH_ID,
        B.BATCH_CODE,
        B.BATCH_NAME,
        B.STATUS,
        B.START_DATE,
        C.COURSE_NAME,
        COUNT(CASE WHEN E.STATUS = 'ACTIVE' THEN 1 END) AS TOTAL_STUDENTS
      FROM BATCHES B
      JOIN COURSES C ON B.COURSE_ID = C.COURSE_ID
      LEFT JOIN ENROLLMENTS E ON B.BATCH_ID = E.BATCH_ID
      WHERE B.TEACHER_ID = :teacherId
      GROUP BY
        B.BATCH_ID,
        B.BATCH_CODE,
        B.BATCH_NAME,
        B.STATUS,
        B.START_DATE,
        C.COURSE_NAME
      ORDER BY B.START_DATE DESC
    `,
    { teacherId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const batches = result.rows.map((row) => ({
    id: row.BATCH_ID,
    code: row.BATCH_CODE,
    name: row.BATCH_NAME,
    courseName: row.COURSE_NAME,
    status: row.STATUS,
    startDate: row.START_DATE,
    totalStudents: Number(row.TOTAL_STUDENTS),
  }));

  return sendResponse(
    res,
    200,
    "Teacher batches retrieved successfully.",
    batches,
  );
});

export const getTeacherSchedule = asyncHandler(async (req, res) => {
  const teacherId = req.user.userId;

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
      JOIN BATCHES B ON BS.BATCH_ID = B.BATCH_ID
      JOIN COURSES C ON B.COURSE_ID = C.COURSE_ID
      WHERE B.TEACHER_ID = :teacherId
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
    { teacherId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
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
    "Teacher schedule retrieved successfully.",
    schedule,
  );
});
