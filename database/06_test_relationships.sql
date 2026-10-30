
-- ============================================
-- SCRIPT 06: TEST DATABASE RELATIONSHIPS
-- All test data will be rolled back.
-- ============================================

SET SERVEROUTPUT ON;

DECLARE
    v_teacher_user_id NUMBER;
    v_student_user_id NUMBER;
    v_teacher_id NUMBER;
    v_student_id NUMBER;
    v_course_id NUMBER;
    v_batch_id NUMBER;
    v_enrollment_id NUMBER;
BEGIN

    -- 1. Create test teacher account
    INSERT INTO USERS (
        role_id, full_name, email, password_hash
    )
    VALUES (
        2,
        'Test Teacher',
        'test.teacher@example.local',
        'TEST_HASH_NOT_FOR_LOGIN'
    )
    RETURNING user_id INTO v_teacher_user_id;

    -- 2. Create teacher profile
    INSERT INTO TEACHERS (
        teacher_id, employee_code, qualification
    )
    VALUES (
        v_teacher_user_id,
        'TEST-TEACHER-001',
        'Test Qualification'
    );

    v_teacher_id := v_teacher_user_id;

    -- 3. Create test student account
    INSERT INTO USERS (
        role_id, full_name, email, password_hash
    )
    VALUES (
        3,
        'Test Student',
        'test.student@example.local',
        'TEST_HASH_NOT_FOR_LOGIN'
    )
    RETURNING user_id INTO v_student_user_id;

    -- 4. Create student profile
    INSERT INTO STUDENTS (
        student_id, student_code
    )
    VALUES (
        v_student_user_id,
        'TEST-STUDENT-001'
    );

    v_student_id := v_student_user_id;

    -- 5. Create course
    INSERT INTO COURSES (
        course_code,
        course_name,
        duration_months,
        base_fee
    )
    VALUES (
        'TEST-COURSE',
        'Test Web Development',
        3,
        5000
    )
    RETURNING course_id INTO v_course_id;

    -- 6. Create batch
    INSERT INTO BATCHES (
        course_id,
        teacher_id,
        batch_code,
        batch_name,
        start_date,
        end_date,
        capacity
    )
    VALUES (
        v_course_id,
        v_teacher_id,
        'TEST-BATCH',
        'Test Batch A',
        TRUNC(SYSDATE),
        TRUNC(SYSDATE) + 90,
        20
    )
    RETURNING batch_id INTO v_batch_id;

    -- 7. Create batch schedule
    INSERT INTO BATCH_SCHEDULES (
        batch_id,
        day_of_week,
        start_time,
        end_time
    )
    VALUES (
        v_batch_id,
        'SUNDAY',
        '09:00',
        '10:30'
    );

    -- 8. Enroll student
    INSERT INTO ENROLLMENTS (
        student_id,
        batch_id,
        agreed_fee,
        discount_amount
    )
    VALUES (
        v_student_id,
        v_batch_id,
        5000,
        500
    )
    RETURNING enrollment_id INTO v_enrollment_id;

    -- 9. Record attendance
    INSERT INTO ATTENDANCE (
        enrollment_id,
        marked_by,
        attendance_date,
        status
    )
    VALUES (
        v_enrollment_id,
        v_teacher_user_id,
        TRUNC(SYSDATE),
        'PRESENT'
    );

    -- 10. Record payment
    INSERT INTO PAYMENTS (
        enrollment_id,
        received_by,
        amount,
        payment_method,
        status
    )
    VALUES (
        v_enrollment_id,
        v_teacher_user_id,
        1000,
        'CASH',
        'COMPLETED'
    );

    DBMS_OUTPUT.PUT_LINE(
        'SUCCESS: All relationship tests passed.'
    );

    DBMS_OUTPUT.PUT_LINE(
        'Test user, profile, course, batch, enrollment, attendance and payment created.'
    );

    -- Remove all temporary test records
    ROLLBACK;

    DBMS_OUTPUT.PUT_LINE(
        'ROLLBACK: All temporary test records removed.'
    );

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('TEST FAILED: ' || SQLERRM);
        RAISE;
END;
/
