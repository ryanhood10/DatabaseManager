try {
  if (process.env.NODE_ENV === 'development') {
      require('dotenv').config();
  }
} catch (error) {
  console.warn('dotenv module not found; skipping loading environment variables from .env file.');
}

const express = require('express');
const cors = require('cors');
const path = require('path');

const { getDepartments, addDepartment, deleteDepartment, updateDepartmentName } = require('./db/queries/department');
const { getEmployees, addEmployee, deleteEmployee, updateEmployeeRole, updateEmployeeManager } = require('./db/queries/employee');
const { getRoles, addRole, deleteRole, updateRoleTitle, updateRoleSalary } = require('./db/queries/role');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cors());

// Routes for Departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await getDepartments();
    res.json(departments || []);  // Ensure an empty array is returned if there are no results
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { departmentName } = req.body;
    const departmentId = await addDepartment(departmentName);
    res.status(201).json({ id: departmentId, message: 'Department added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteDepartment(id);
    if (affectedRows > 0) {
      res.json({ message: 'Department deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Department not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const affectedRows = await updateDepartmentName(id, name);
    if (affectedRows > 0) {
      res.json({ message: 'Department updated successfully.' });
    } else {
      res.status(404).json({ message: 'Department not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for Employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await getEmployees();
    res.json(employees|| []); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { firstName, lastName, roleId, managerId } = req.body;
    const employeeId = await addEmployee(firstName, lastName, roleId, managerId);
    res.status(201).json({ id: employeeId, message: 'Employee added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteEmployee(id);
    if (affectedRows > 0) {
      res.json({ message: 'Employee deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Employee not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;
    const affectedRows = await updateEmployeeRole(id, roleId);
    if (affectedRows > 0) {
      res.json({ message: 'Employee role updated successfully.' });
    } else {
      res.status(404).json({ message: 'Employee not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id/manager', async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;
    const affectedRows = await updateEmployeeManager(id, managerId);
    if (affectedRows > 0) {
      res.json({ message: 'Employee manager updated successfully.' });
    } else {
      res.status(404).json({ message: 'Employee not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for Roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles|| []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { title, salary, department_id } = req.body;
    const roleId = await addRole(title, salary, department_id);
    res.status(201).json({ id: roleId, message: 'Role added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteRole(id);
    if (affectedRows > 0) {
      res.json({ message: 'Role deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Role not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/roles/:id/title', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const affectedRows = await updateRoleTitle(id, title);
    if (affectedRows > 0) {
      res.json({ message: 'Role title updated successfully.' });
    } else {
      res.status(404).json({ message: 'Role not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/roles/:id/salary', async (req, res) => {
  try {
    const { id } = req.params;
    const { salary } = req.body;
    const affectedRows = await updateRoleSalary(id, salary);
    if (affectedRows > 0) {
      res.json({ message: 'Role salary updated successfully.' });
    } else {
      res.status(404).json({ message: 'Role not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
