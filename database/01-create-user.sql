
-- Create the application schema user.

CREATE USER COACHING
IDENTIFIED BY "109310";

-- Grant only the required development privileges.

GRANT
    CREATE SESSION,
    CREATE TABLE,
    CREATE SEQUENCE,
    CREATE VIEW,
    CREATE PROCEDURE,
    CREATE TRIGGER
TO COACHING;

-- Allow the schema to allocate space in USERS.

ALTER USER COACHING
QUOTA UNLIMITED ON USERS;
