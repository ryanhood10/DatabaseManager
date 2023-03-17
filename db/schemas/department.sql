DROP DATABASE IF EXISTS department_db;

CREATE DATABASE department_db;

USE department_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
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
