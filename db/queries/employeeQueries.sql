
-- Query to get all employees with their information and managers' names
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;

-- Query to add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 2);

-- Query to delete an employee
DELETE FROM employee
WHERE id = <employee_id>;

-- Query to update an employee's role
UPDATE employee
SET role_id = <new_role_id>
WHERE id = <employee_id>;

-- Query to update an employee's manager
UPDATE employee
SET manager_id = <new_manager_id>
WHERE id = <employee_id>;
