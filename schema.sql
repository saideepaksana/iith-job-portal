CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE IF NOT EXISTS users
(
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    is_verified         TINYINT(1) DEFAULT 0,
    verification_token  CHAR(64),
    role ENUM('student','recruiter') NOT NULL,
    year TINYINT,
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);