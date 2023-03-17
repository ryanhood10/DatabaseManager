DROP DATABASE IF EXISTS department_db;

CREATE DATABASE department_db;

USE department_db;

-- creating the department table
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


