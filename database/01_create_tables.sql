-- ============================================
-- COACHING CENTER MANAGEMENT SYSTEM
-- SCRIPT 01: CREATE TABLES
-- Oracle Database 23ai Free
-- ============================================


-- 1. ROLES
CREATE TABLE ROLES (
    role_id NUMBER(5) NOT NULL,
    role_name VARCHAR2(30) NOT NULL,
    description VARCHAR2(200),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT pk_roles PRIMARY KEY (role_id)
);


-- 2. USERS
CREATE TABLE USERS (
    user_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    role_id NUMBER(5) NOT NULL,
    full_name VARCHAR2(120) NOT NULL,
    email VARCHAR2(150) NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    phone VARCHAR2(20),
    account_status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    last_login_at TIMESTAMP(6),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_users PRIMARY KEY (user_id)
);


-- 3. STUDENTS
CREATE TABLE STUDENTS (
    student_id NUMBER(10) NOT NULL,
    student_code VARCHAR2(30) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR2(30),
    address VARCHAR2(300),
    guardian_name VARCHAR2(120),
    guardian_phone VARCHAR2(20),
    admission_date DATE DEFAULT SYSDATE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_students PRIMARY KEY (student_id)
);


-- 4. TEACHERS
CREATE TABLE TEACHERS (
    teacher_id NUMBER(10) NOT NULL,
    employee_code VARCHAR2(30) NOT NULL,
    qualification VARCHAR2(150),
    specialization VARCHAR2(150),
    hire_date DATE DEFAULT SYSDATE NOT NULL,
    employment_status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_teachers PRIMARY KEY (teacher_id)
);


-- 5. COURSES
CREATE TABLE COURSES (
    course_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    course_code VARCHAR2(30) NOT NULL,
    course_name VARCHAR2(120) NOT NULL,
    description VARCHAR2(500),
    duration_months NUMBER(3) NOT NULL,
    base_fee NUMBER(10,2) DEFAULT 0 NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_courses PRIMARY KEY (course_id)
);


-- 6. BATCHES
CREATE TABLE BATCHES (
    batch_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    course_id NUMBER(10) NOT NULL,
    teacher_id NUMBER(10),
    batch_code VARCHAR2(30) NOT NULL,
    batch_name VARCHAR2(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    capacity NUMBER(5) NOT NULL,
    status VARCHAR2(20) DEFAULT 'PLANNED' NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_batches PRIMARY KEY (batch_id)
);


-- 7. BATCH_SCHEDULES
CREATE TABLE BATCH_SCHEDULES (
    schedule_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    batch_id NUMBER(10) NOT NULL,
    day_of_week VARCHAR2(9) NOT NULL,
    start_time VARCHAR2(5) NOT NULL,
    end_time VARCHAR2(5) NOT NULL,
    room_name VARCHAR2(50),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT pk_batch_schedules PRIMARY KEY (schedule_id)
);


-- 8. ENROLLMENTS
CREATE TABLE ENROLLMENTS (
    enrollment_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    student_id NUMBER(10) NOT NULL,
    batch_id NUMBER(10) NOT NULL,
    enrollment_date DATE DEFAULT SYSDATE NOT NULL,
    agreed_fee NUMBER(10,2) NOT NULL,
    discount_amount NUMBER(10,2) DEFAULT 0 NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_enrollments PRIMARY KEY (enrollment_id)
);


-- 9. ATTENDANCE
CREATE TABLE ATTENDANCE (
    attendance_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    enrollment_id NUMBER(10) NOT NULL,
    marked_by NUMBER(10) NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR2(15) NOT NULL,
    remarks VARCHAR2(300),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6),

    CONSTRAINT pk_attendance PRIMARY KEY (attendance_id)
);


-- 10. PAYMENTS
CREATE TABLE PAYMENTS (
    payment_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    enrollment_id NUMBER(10) NOT NULL,
    received_by NUMBER(10) NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    payment_date TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_method VARCHAR2(20) NOT NULL,
    transaction_reference VARCHAR2(100),
    status VARCHAR2(20) DEFAULT 'COMPLETED' NOT NULL,
    remarks VARCHAR2(300),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT pk_payments PRIMARY KEY (payment_id)
);


-- 11. PASSWORD_RESETS
CREATE TABLE PASSWORD_RESETS (
    reset_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    user_id NUMBER(10) NOT NULL,
    token_hash VARCHAR2(255) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    used_at TIMESTAMP(6),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT pk_password_resets PRIMARY KEY (reset_id)
);


-- 12. AUDIT_LOGS
CREATE TABLE AUDIT_LOGS (
    log_id NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    user_id NUMBER(10),
    action VARCHAR2(100) NOT NULL,
    entity_type VARCHAR2(50) NOT NULL,
    entity_id NUMBER(10),
    details CLOB,
    ip_address VARCHAR2(45),
    user_agent VARCHAR2(500),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT pk_audit_logs PRIMARY KEY (log_id)
);


-- ============================================
-- END OF SCRIPT 01
-- ============================================