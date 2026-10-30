-- ============================================
-- SCRIPT 04: INSERT INITIAL DATA
-- ============================================


INSERT INTO ROLES (
    role_id,
    role_name,
    description
)
VALUES (
    1,
    'ADMIN',
    'System administrator'
);


INSERT INTO ROLES (
    role_id,
    role_name,
    description
)
VALUES (
    2,
    'TEACHER',
    'Coaching center teacher'
);


INSERT INTO ROLES (
    role_id,
    role_name,
    description
)
VALUES (
    3,
    'STUDENT',
    'Registered coaching center student'
);


COMMIT;


-- ============================================
-- END OF SCRIPT 04
-- ============================================