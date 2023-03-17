DROP DATABASE IF EXISTS department_db;

CREATE DATABASE department_db;

USE department_db;

-- creating the department table
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


-- Creating the role Table
CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
-- DROP DATABASE IF EXISTS department_db;

-- CREATE DATABASE department_db;

-- USE department_db;

-- CREATE TABLE courses (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(50) NOT NULL,
--     instructor VARCHAR(50) NOT NULL,
--     department VARCHAR(50) NOT NULL,
--     credits INT NOT NULL
-- );

-- CREATE TABLE department (
--     id INT PRIMARY KEY,
--     name VARCHAR(30) NOT NULL
-- );
