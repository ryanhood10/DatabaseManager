import React, { useState, useEffect } from 'react';

function DatabasePage() {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [newDepartment, setNewDepartment] = useState('');
  const [newRole, setNewRole] = useState({ title: '', salary: '', departmentId: '' });
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', roleId: '', managerId: null });

  const [selectedEmployee, setSelectedEmployee] = useState({ id: '', newRoleId: '' });

  // Base URL for the backend API
  const apiBaseUrl = 'http://localhost:3001';

  // Fetch all departments, roles, and employees when the component mounts
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/departments`)
      .then(response => response.json())
      .then(data => setDepartments(data));
      
    fetch(`${apiBaseUrl}/api/roles`)
      .then(response => response.json())
      .then(data => setRoles(data));
      
    fetch(`${apiBaseUrl}/api/employees`)
      .then(response => response.json())
      .then(data => setEmployees(data));
  }, [apiBaseUrl]);

  const handleAddDepartment = () => {
    fetch(`${apiBaseUrl}/api/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departmentName: newDepartment })
    }).then(response => response.json()).then(() => {
      setNewDepartment('');
      window.location.reload();
    });
  };

  const handleAddRole = () => {
    fetch(`${apiBaseUrl}/api/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRole)
    }).then(response => response.json()).then(() => {
      setNewRole({ title: '', salary: '', departmentId: '' });
      window.location.reload();
    });
  };

  const handleAddEmployee = () => {
    fetch(`${apiBaseUrl}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    }).then(response => response.json()).then(() => {
      setNewEmployee({ firstName: '', lastName: '', roleId: '', managerId: null });
      window.location.reload();
    });
  };

  const handleUpdateEmployeeRole = () => {
    fetch(`${apiBaseUrl}/api/employees/${selectedEmployee.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId: selectedEmployee.newRoleId }) // use roleId instead of newRole
    }).then(response => response.json()).then(() => {
      setSelectedEmployee({ id: '', newRoleId: '' });
      window.location.reload();
    });
  };
  
  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        setEmployees(employees.filter(employee => employee.id !== id));
      } else {
        console.error('Failed to delete the employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Employee Manager</h1>

      {/* Add Department */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Department</h2>
        <input
          type="text"
          placeholder="Department Name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="border rounded-md px-4 py-2 w-full mb-2"
        />
        <button onClick={handleAddDepartment} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Department
        </button>
      </div>

      {/* Add Role */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Role</h2>
        <input
          type="text"
          placeholder="Role Title"
          value={newRole.title}
          onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Salary"
          value={newRole.salary}
          onChange={(e) => setNewRole({ ...newRole, salary: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        />
        <select
          value={newRole.departmentId}
          onChange={(e) => setNewRole({ ...newRole, departmentId: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        >
          <option value="">Select Department</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>
        <button onClick={handleAddRole} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Role
        </button>
      </div>

      {/* Add Employee */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Employee</h2>
        <input
          type="text"
          placeholder="First Name"
          value={newEmployee.firstName}
          onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newEmployee.lastName}
          onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        />
        <select
          value={newEmployee.roleId}
          onChange={(e) => setNewEmployee({ ...newEmployee, roleId: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.title}</option>
          ))}
        </select>
        <button onClick={handleAddEmployee} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Employee
        </button>
      </div>

      {/* Update Employee Role */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Update Employee Role</h2>
        <select
          value={selectedEmployee.id}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, id: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        >
          <option value="">Select Employee</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
        <select
          value={selectedEmployee.newRoleId}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, newRoleId: e.target.value })}
          className="border rounded-md px-4 py-2 w-full mb-2"
        >
          <option value="">Select New Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.title}</option>
          ))}
        </select>
        <button onClick={handleUpdateEmployeeRole} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Update Role
        </button>
      </div>

      {/* Display Employees */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Employees</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className="border-t">
                <td className="py-2">{employee.first_name} {employee.last_name}</td>
                <td className="py-2">{roles.find(role => role.id === employee.role_id)?.title}</td>
                <td className="py-2">
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded-md" 
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatabasePage;
