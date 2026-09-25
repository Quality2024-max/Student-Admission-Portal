CREATE DATABASE collage_admission_db;
USE collage_admission_db;

CREATE TABLE IF NOT EXISTS user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_no VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    dob DATE,
    email VARCHAR(150),
    phone VARCHAR(15),
    course VARCHAR(60) NOT NULL,
    semester VARCHAR(40),
    qualification VARCHAR(150),
    score DECIMAL(5,2),
    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',
    applied_on DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_no VARCHAR(30) NOT NULL UNIQUE,
    application_id INT NOT NULL UNIQUE,
    admission_date DATE DEFAULT (CURRENT_DATE),
    course VARCHAR(60) NOT NULL,
    semester VARCHAR(40),
    status ENUM(
        'Confirmed',
        'Cancelled'
    ) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admission_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE RESTRICT
);




CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL UNIQUE,
    roll VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    course VARCHAR(60) NOT NULL,
    semester VARCHAR(40) NOT NULL,
    status ENUM(
        'Active',
        'On Hold',
        'Graduated'
    ) DEFAULT 'Active',
    contact VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_admission
        FOREIGN KEY (admission_id)
        REFERENCES admissions(id)
        ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2)
        GENERATED ALWAYS AS (total - paid) STORED,
    status ENUM(
        'Unpaid',
        'Partial',
        'Paid'
    ) DEFAULT 'Unpaid',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fee_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);




CREATE TABLE IF NOT EXISTS fee_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    mode ENUM(
        'Cash',
        'UPI',
        'Card',
        'Bank Transfer'
    ) NOT NULL,
    transaction_no VARCHAR(100),
    paid_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_fee
        FOREIGN KEY (fee_id)
        REFERENCES fees(id)
        ON DELETE CASCADE
);