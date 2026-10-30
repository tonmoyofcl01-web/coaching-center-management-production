-- ============================================
-- SCRIPT 02: ADD CONSTRAINTS
-- ============================================


-- ROLES
ALTER TABLE ROLES
ADD CONSTRAINT uq_roles_name UNIQUE (role_name);


ALTER TABLE ROLES
ADD CONSTRAINT chk_roles_name
CHECK (role_name IN ('ADMIN', 'TEACHER', 'STUDENT'));


-- USERS
ALTER TABLE USERS
ADD CONSTRAINT fk_users_role
FOREIGN KEY (role_id)
REFERENCES ROLES(role_id);


ALTER TABLE USERS
ADD CONSTRAINT uq_users_email UNIQUE (email);


ALTER TABLE USERS
ADD CONSTRAINT chk_users_status
CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'));


-- STUDENTS
ALTER TABLE STUDENTS
ADD CONSTRAINT fk_students_user
FOREIGN KEY (student_id)
REFERENCES USERS(user_id);


ALTER TABLE STUDENTS
ADD CONSTRAINT uq_students_code UNIQUE (student_code);


ALTER TABLE STUDENTS
ADD CONSTRAINT chk_students_gender
CHECK (
    gender IS NULL OR
    gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')
);


-- TEACHERS
ALTER TABLE TEACHERS
ADD CONSTRAINT fk_teachers_user
FOREIGN KEY (teacher_id)
REFERENCES USERS(user_id);


ALTER TABLE TEACHERS
ADD CONSTRAINT uq_teachers_code UNIQUE (employee_code);


ALTER TABLE TEACHERS
ADD CONSTRAINT chk_teachers_status
CHECK (employment_status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE'));


-- COURSES
ALTER TABLE COURSES
ADD CONSTRAINT uq_courses_code UNIQUE (course_code);


ALTER TABLE COURSES
ADD CONSTRAINT chk_courses_duration
CHECK (duration_months > 0);


ALTER TABLE COURSES
ADD CONSTRAINT chk_courses_fee
CHECK (base_fee >= 0);


ALTER TABLE COURSES
ADD CONSTRAINT chk_courses_status
CHECK (status IN ('ACTIVE', 'INACTIVE'));


-- BATCHES
ALTER TABLE BATCHES
ADD CONSTRAINT fk_batches_course
FOREIGN KEY (course_id)
REFERENCES COURSES(course_id);


ALTER TABLE BATCHES
ADD CONSTRAINT fk_batches_teacher
FOREIGN KEY (teacher_id)
REFERENCES TEACHERS(teacher_id);


ALTER TABLE BATCHES
ADD CONSTRAINT uq_batches_code UNIQUE (batch_code);


ALTER TABLE BATCHES
ADD CONSTRAINT chk_batches_capacity
CHECK (capacity > 0);


ALTER TABLE BATCHES
ADD CONSTRAINT chk_batches_dates
CHECK (end_date IS NULL OR end_date >= start_date);


ALTER TABLE BATCHES
ADD CONSTRAINT chk_batches_status
CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'));


-- BATCH SCHEDULES
ALTER TABLE BATCH_SCHEDULES
ADD CONSTRAINT fk_schedules_batch
FOREIGN KEY (batch_id)
REFERENCES BATCHES(batch_id);


ALTER TABLE BATCH_SCHEDULES
ADD CONSTRAINT chk_schedule_day
CHECK (
    day_of_week IN (
        'SUNDAY', 'MONDAY', 'TUESDAY',
        'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
    )
);


ALTER TABLE BATCH_SCHEDULES
ADD CONSTRAINT chk_schedule_start
CHECK (
    REGEXP_LIKE(
        start_time,
        '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
    )
);


ALTER TABLE BATCH_SCHEDULES
ADD CONSTRAINT chk_schedule_end
CHECK (
    REGEXP_LIKE(
        end_time,
        '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
    )
);


ALTER TABLE BATCH_SCHEDULES
ADD CONSTRAINT chk_schedule_time_order
CHECK (end_time > start_time);


-- ENROLLMENTS
ALTER TABLE ENROLLMENTS
ADD CONSTRAINT fk_enrollments_student
FOREIGN KEY (student_id)
REFERENCES STUDENTS(student_id);


ALTER TABLE ENROLLMENTS
ADD CONSTRAINT fk_enrollments_batch
FOREIGN KEY (batch_id)
REFERENCES BATCHES(batch_id);


ALTER TABLE ENROLLMENTS
ADD CONSTRAINT uq_enrollment_student_batch
UNIQUE (student_id, batch_id);


ALTER TABLE ENROLLMENTS
ADD CONSTRAINT chk_enrollment_fee
CHECK (agreed_fee >= 0);


ALTER TABLE ENROLLMENTS
ADD CONSTRAINT chk_enrollment_discount
CHECK (
    discount_amount >= 0
    AND discount_amount <= agreed_fee
);


ALTER TABLE ENROLLMENTS
ADD CONSTRAINT chk_enrollment_status
CHECK (
    status IN ('ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED')
);


-- ATTENDANCE
ALTER TABLE ATTENDANCE
ADD CONSTRAINT fk_attendance_enrollment
FOREIGN KEY (enrollment_id)
REFERENCES ENROLLMENTS(enrollment_id);


ALTER TABLE ATTENDANCE
ADD CONSTRAINT fk_attendance_marker
FOREIGN KEY (marked_by)
REFERENCES USERS(user_id);


ALTER TABLE ATTENDANCE
ADD CONSTRAINT chk_attendance_status
CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'));


-- PAYMENTS
ALTER TABLE PAYMENTS
ADD CONSTRAINT fk_payments_enrollment
FOREIGN KEY (enrollment_id)
REFERENCES ENROLLMENTS(enrollment_id);


ALTER TABLE PAYMENTS
ADD CONSTRAINT fk_payments_receiver
FOREIGN KEY (received_by)
REFERENCES USERS(user_id);


ALTER TABLE PAYMENTS
ADD CONSTRAINT chk_payment_amount
CHECK (amount > 0);


ALTER TABLE PAYMENTS
ADD CONSTRAINT chk_payment_method
CHECK (
    payment_method IN ('CASH', 'BANK', 'BKASH', 'NAGAD', 'OTHER')
);


ALTER TABLE PAYMENTS
ADD CONSTRAINT chk_payment_status
CHECK (
    status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')
);


-- PASSWORD RESETS
ALTER TABLE PASSWORD_RESETS
ADD CONSTRAINT fk_resets_user
FOREIGN KEY (user_id)
REFERENCES USERS(user_id);


ALTER TABLE PASSWORD_RESETS
ADD CONSTRAINT uq_reset_token UNIQUE (token_hash);


ALTER TABLE PASSWORD_RESETS
ADD CONSTRAINT chk_reset_expiry
CHECK (expires_at > created_at);


-- AUDIT LOGS
ALTER TABLE AUDIT_LOGS
ADD CONSTRAINT fk_audit_user
FOREIGN KEY (user_id)
REFERENCES USERS(user_id)
ON DELETE SET NULL;


-- ============================================
-- END OF SCRIPT 02
-- ============================================