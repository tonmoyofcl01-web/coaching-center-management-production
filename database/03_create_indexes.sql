-- ============================================
-- SCRIPT 03: CREATE INDEXES
-- ============================================


-- USERS
CREATE INDEX idx_users_role
ON USERS(role_id);


-- BATCHES
CREATE INDEX idx_batches_course
ON BATCHES(course_id);

CREATE INDEX idx_batches_teacher
ON BATCHES(teacher_id);


-- BATCH SCHEDULES
CREATE INDEX idx_schedules_batch
ON BATCH_SCHEDULES(batch_id);


-- ENROLLMENTS
CREATE INDEX idx_enrollments_student
ON ENROLLMENTS(student_id);

CREATE INDEX idx_enrollments_batch
ON ENROLLMENTS(batch_id);


-- ATTENDANCE
CREATE UNIQUE INDEX uq_attendance_day
ON ATTENDANCE(enrollment_id, TRUNC(attendance_date));

CREATE INDEX idx_attendance_marker
ON ATTENDANCE(marked_by);


-- PAYMENTS
CREATE INDEX idx_payments_enrollment
ON PAYMENTS(enrollment_id);

CREATE INDEX idx_payments_receiver
ON PAYMENTS(received_by);


-- PASSWORD RESETS
CREATE INDEX idx_resets_user
ON PASSWORD_RESETS(user_id);


-- AUDIT LOGS
CREATE INDEX idx_audit_user
ON AUDIT_LOGS(user_id);

CREATE INDEX idx_audit_created
ON AUDIT_LOGS(created_at);


-- ============================================
-- END OF SCRIPT 03
-- ============================================