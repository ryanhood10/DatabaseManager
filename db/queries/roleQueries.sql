--View all roles
SELECT role.id, role.title, department.name AS department, role.salary
FROM role
LEFT JOIN department ON role.department_id = department.id;

-- add a role
INSERT INTO role (title, salary, department_id)
VALUES ('New Role', 60000, 2);

--delete a role
DELETE FROM role
WHERE id = <role_id>;

--update a role's title
UPDATE role
SET title = 'New Title'
WHERE id = <role_id>;

--update a role's salary
UPDATE role
SET salary = 80000
WHERE id = <role_id>;
