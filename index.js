// const fs = require('fs');
// const path = require('path');

// const roleSchemaPath = path.join(__dirname, './schemas/role.sql');
// const roleSchema = fs.readFileSync(roleSchemaPath, 'utf-8');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employee_db',
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

pool.connect(
  (err) => {
 //   console.log(err)
  }
);

// //testing pool using .query() method directly
// pool.promise().query('SELECT * from department').then(([rows, fields]) => {
//     console.log('The solution is:', rows);
// //    pool.end();
// }).catch(err => {
//     console.error('Error executing query', err.stack);
// });

//inquirer prompt
//defining functions to use in questions

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Please choose from the list below:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
        ],
      },
    ])
    .then((answers) => {
      if (answers.choice === 'View all departments') {
        // Call function to view all departments
      } else if (answers.choice === 'View all roles') {
        // Call function to view all roles
      } else if (answers.choice === 'View all employees') {
        // Call function to view all employees
      } else if (answers.choice === 'Add a department') {
        // Call a function to add a department
        addDepartment();
      } else if (answers.choice === 'Add a role') {
        //call a function to add a role
        addRole();
      } else if (answers.choice === 'Add an employee') {
        //call a function to add an employee
        addEmployee();
      } else if (answers.choice === 'Update an employee role') {
        //call a function to update employee
        updateEmployeeRole();
      } else {
        console.log('input not valid');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

   // Call function to add a department
   function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department:',
        },
      ])
      .then((departmentAnswers) => {
        // Call function to add a department with departmentAnswers.departmentName
        // Replace the following with your function to add the department to the database
        const query = `INSERT INTO department (name) VALUES (?)`;
        pool.promise().query(query, [departmentAnswers.departmentName])
          .then(() => {
            console.log('Department added successfully.');
            mainMenu(); // Return to the main menu
          })
          .catch((error) => {
            console.log('Error adding the department:', error);
            mainMenu(); // Return to the main menu
          });
      });
  }
  
  //write a function to grab the department choices so we can display them

function addRole() {
  // Retrieve department data for choices
  const departmentChoices = []; // Replace with a function call that retrieves department data

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
        validate: (value) => {
          if (isNaN(value)) {
            return 'Please enter a valid number';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ])
    .then((roleAnswers) => {
      // Call function to add a role with roleAnswers.roleName, roleAnswers.roleSalary, and roleAnswers.roleDepartment
      // Replace the following with your function to add the role to the database
      const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      pool.promise().query(query, [roleAnswers.roleName, roleAnswers.roleSalary, roleAnswers.roleDepartment])
        .then(() => {
          console.log('Role added successfully.');
          mainMenu(); // Return to the main menu
        })
        .catch((error) => {
          console.log('Error adding the role:', error);
          mainMenu(); // Return to the main menu
        });
    });
}

function addEmployee() {
  // Retrieve role and manager data for choices
  const roleChoices = []; // Replace with a function call that retrieves role data
  const managerChoices = []; // Replace with a function call that retrieves manager data

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'list',
        name: 'employeeRole',
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ])
    .then((employeeAnswers) => {
      console.log('employee added!')
      // Call function to add an employee with employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.employeeRole, and employeeAnswers.employeeManager
      // Replace the following with your function to add the employee to the database
      const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      pool.promise().query(query, [employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.employeeRole, employeeAnswers.employeeManager])
        .then(() => {
          console.log('Employee added successfully.');
          mainMenu(); // Return to the main menu
        })
        .catch((error) => {
          console.log('Error adding the employee:', error);
          mainMenu(); // Return to the main menu
        });
    });
}


function updateEmployeeRole() {
  // Retrieve employee and role data for choices
  const employeeChoices = []; // Replace with a function call that retrieves employee data
  const roleChoices = []; // Replace with a function call that retrieves role data

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectedEmployee',
        message: 'Select an employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'newRole',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      },
    ])
    .then((updateAnswers) => {
      // Call function to update the employee's role with updateAnswers.selectedEmployee and updateAnswers.newRole
      // Replace the following with your function to update the employee's role in the database
      const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      pool.promise().query(query, [updateAnswers.newRole, updateAnswers.selectedEmployee])
        .then(() => {
          console.log('Employee role updated successfully.');
          mainMenu(); // Return to the main menu
        })
        .catch((error) => {
          console.log('Error updating the employee role:', error);
          mainMenu(); // Return to the main menu
        });
    });
}

// Start the application on inquirer by calling the mainMenu function
mainMenu();




