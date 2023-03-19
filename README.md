# EmployeeManager

Employee Manager is a command-line application for managing departments, roles, and employees in a company. It allows you to easily view and manage company information, so you can organize and plan your business more effectively.

## Features
View all departments, roles, and employees in a formatted table
Add new departments, roles, or employees
Update existing employee roles
## Technologies Used
Node.js
Express.js
MySQL2
Inquirer
dotenv
## Installation
Clone the repository.
Run npm install to install the required dependencies.
Create a .env file in the root directory and add your MySQL database credentials:
DB_HOST=<your_host>
DB_USER=<your_user>
DB_PASS=<your_password>
DB_NAME=<your_database_name>
Import the provided SQL schema files into your MySQL database.
Run the application with node index.js.

## Usage
When you start the application, you will be presented with a list of options:

View all departments
View all roles
View all employees
Add a department
Add a role
Add an employee
Update an employee role
Select an option to view or modify company information. When you choose to add or update data, you will be prompted to enter the necessary information. The application will then update the database accordingly.

To exit the application, simply close the command prompt or terminal window.

## Contributions
This application was created by Ryan Hood. 
github: https://github.com/ryanhood10
