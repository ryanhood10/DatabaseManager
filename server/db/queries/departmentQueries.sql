-- query to get departments
SELECT id, name
FROM department;

-- query to add a department
INSERT INTO department (name)
VALUES (?);

-- query to delete a department
DELETE FROM department
WHERE id = ?;

-- query to update a department name
UPDATE department
SET name = ?
WHERE id = ?;
