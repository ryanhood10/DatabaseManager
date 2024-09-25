import React, { useState, useEffect } from 'react';
import ShorelineLogo from '../assets/PalmTreeTransparent.png';

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

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Update the state to remove the deleted department from the list without reloading
        setDepartments(departments.filter((department) => department.id !== id));
      } else {
        console.error('Failed to delete the department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
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

  const handleDeleteRole = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Update the state to remove the deleted role from the list without reloading
        setRoles(roles.filter((role) => role.id !== id));
      } else {
        console.error('Failed to delete the role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
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
  

  // State to manage the visibility of the departments list
  const [isListVisible, setIsListVisible] = useState(false);

  // Function to toggle the list visibility
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const [isRolesListVisible, setIsRolesListVisible] = useState(false);

  const toggleRolesListVisibility = () => {
    setIsRolesListVisible(!isRolesListVisible);
  };
  
  const [isEmployeesListVisible, setIsEmployeesListVisible] = useState(false);

  const toggleEmployeesListVisibility = () => {
    setIsEmployeesListVisible(!isEmployeesListVisible);
  };
  

  return (
    <div className="w-full bg-gray-900">
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
    <div className="flex items-center justify-center p-4 bg-gray-700 rounded-xl border-gray-600 border-2 ">
          <img src={ShorelineLogo} alt="Shoreline Logo" className="filter invert h-16 w-20 md:h-20 md:w-24 mr-4" />
          <h1 className="text-2xl font-bold  md:text-3xl">
            Employee Database Manager
       </h1>
          <img src={ShorelineLogo} alt="Shoreline Logo" className="filter invert h-16 w-20 md:h-20 md:w-24 ml-4 transform scale-x-[-1]" />
        </div>


  
      {/* Add Department Section */}
      <div className="mb-6 border-b border-gray-700 pt-8 pb-4">
        <h2 className="text-2xl font-semibold py-4 ">Departments</h2>
        <div className='flex space-x-4'>
        <input
          type="text"
          placeholder="Department Name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="border border-gray-600 rounded-md px-4 py-2 w-[80%]  bg-gray-700 text-white"
        />
        <button
          onClick={handleAddDepartment}
          className="bg-blue-500 hover:bg-blue-400 text-white px-4  rounded-md"
        >
          Add Department
        </button>
        </div>
      </div>
  
{/* Display Departments Section */}
<div>
      {/* Toggle button to show/hide the Departments List */}
      <p
        className="text-blue-500 hover:text-blue-400 cursor-pointer mb-4"
        onClick={toggleListVisibility}
      >
        {isListVisible ? 'Hide Departments List' : 'View Departments List'}
      </p>
      <div className="flex justify-end items-end h-full">
      <button
  onClick={() => (window.location.href = '/DepartmentsList')}
  className="bg-transparent hover:bg-cyan-400 hover:bg-opacity-50 text-white px-4 py-2 rounded-md mt-2 flex items-center space-x-2 transition-all duration-300"
>
  <span>Departments Page</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>

      </div>

      {/* Conditionally render the Departments Table if the list is visible */}
      {isListVisible && (
        <div>

                        <h2 className="text-xl font-semibold mb-4">Departments List</h2>
        <div className="max-h-60 overflow-y-auto mb-4 bg-gray-700 rounded-md">
          <table className="min-w-full bg-gray-800 rounded-md shadow-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4">Department Name</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Reverse the departments array before slicing to show the most recent departments first */}
              {departments.slice().reverse().slice(0, 10).map((department) => (
                <tr key={department.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{department.name}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

         
        </div>
         {/* Conditionally render the "View All Departments" button if there are more than 10 departments */}
         {departments.length > 10 && (
            <div className="py-4">
              <button
                onClick={() => (window.location.href = '/DepartmentsList')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              >
                View All Departments
              </button>
            </div>
          )}
        </div>
      )}
    </div>

<hr className='py-4 mt-8'/>

      {/* Add Role Section */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-semibold py-4 ">Roles</h2>
        <div className='flex space-x-4'>
        <input
          type="text"
          placeholder="Role Title"
          value={newRole.title}
          onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Salary"
          value={newRole.salary}
          onChange={(e) => setNewRole({ ...newRole, salary: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        />
        </div>
        <div className='flex space-x-8'>
        <select
          value={newRole.departmentId}
          onChange={(e) => setNewRole({ ...newRole, departmentId: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-[80%] mb-2 bg-gray-700 text-white"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddRole}
          className="bg-blue-500 hover:bg-blue-400 text-white px-4 w-[18%] rounded-md"
        >
          Add Role
        </button>
        </div>
      </div>

     {/* Display Roles Section */}
<div>
  {/* Toggle button to show/hide the Roles List */}
  <p
    className="text-blue-500 hover:text-blue-400 cursor-pointer mb-4"
    onClick={toggleRolesListVisibility}
  >
    {isRolesListVisible ? 'Hide Roles List' : 'View Roles List'}
  </p>
  <div className="flex justify-end items-end h-full">
      <button
  onClick={() => (window.location.href = '/RolesList')}
  className="bg-transparent hover:bg-cyan-400 hover:bg-opacity-50 text-white px-4 py-2 rounded-md mt-2 flex items-center space-x-2 transition-all duration-300"
>
  <span>Roles Page</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>

      </div>

  {/* Conditionally render the Roles Table if the list is visible */}
  {isRolesListVisible && (
    <div>
      <h2 className="text-xl font-semibold mb-4">Roles List</h2>
      <div className="max-h-60 overflow-y-auto mb-4 bg-gray-700 rounded-md">
        <table className="min-w-full bg-gray-800 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4">Role Title</th>
              <th className="py-2 px-4">Salary</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Reverse the roles array before slicing to show the most recent roles first */}
            {roles.slice().reverse().slice(0, 10).map((role) => (
              <tr key={role.id} className="border-t border-gray-700">
                <td className="py-2 px-4">{role.title}</td>
                <td className="py-2 px-4">${role.salary}</td>
                <td className="py-2 px-4">{role.department || 'N/A'}</td>
                <td className="py-2 px-4">
                  {departments.find((department) => department.id === role.departmentId)?.name || 'N/A'}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Conditionally render the "View All Roles" button if there are more than 10 roles */}
      {roles.length > 10 && (
          <div className="py-4">
            <button
              onClick={() => (window.location.href = '/RolesList')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
              View All Roles
            </button>
          </div>
        )}

<p className='text-red-500 text-end pr-4'> ** You may not delete Roles that are currently assigned to an employee! **</p>

    </div>
  )}
</div>


<hr className='py-4 mt-8'/>
  
      {/* Add Employee Section */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-semibold py-4 ">Employees</h2>
        <div className='flex space-x-4'>
        <input
          type="text"
          placeholder="First Name"
          value={newEmployee.firstName}
          onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newEmployee.lastName}
          onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        />
        </div>
        <div className='flex space-x-8'>
        <select
          value={newEmployee.roleId}
          onChange={(e) => setNewEmployee({ ...newEmployee, roleId: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-[80%] mb-2 bg-gray-700 text-white"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 hover:bg-blue-400 text-white px-4  rounded-md"
        >
          Add Employee
        </button>
        </div>
      </div>
  
   
{/* Display Employees Section */}

<div>
  {/* Toggle button to show/hide the Employees List */}
  <p
    className="text-blue-500 hover:text-blue-400 cursor-pointer mb-4"
    onClick={toggleEmployeesListVisibility}
  >
    {isEmployeesListVisible ? 'Hide Employees List' : 'View Employees List'}
  </p>

  <div className="flex justify-end items-end h-full">
      <button
  onClick={() => (window.location.href = '/EmployeesList')}
  className="bg-transparent hover:bg-cyan-400 hover:bg-opacity-50 text-white px-4 py-2 rounded-md mt-2 flex items-center space-x-2 transition-all duration-300"
>
  <span>Employees Page</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>

      </div>

  {/* Conditionally render the Employees Table if the list is visible */}
  {isEmployeesListVisible && (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employees List</h2>
      <div className="max-h-60 overflow-y-auto mb-4 bg-gray-700 rounded-md">
        <table className="min-w-full bg-gray-800 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Reverse the employees array before slicing to show the most recent employees first */}
            {employees.slice().reverse().slice(0, 10).map((employee) => (
              <tr key={employee.id} className="border-t border-gray-700">
                <td className="py-2 px-4">
                  {employee.first_name} {employee.last_name}
                </td>
                <td className="py-2 px-4">
                  {roles.find((role) => role.id === employee.role_id)?.title}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
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
         {/* Conditionally render the "View All Employees" button if there are more than 10 employees */}
         {employees.length > 10 && (
          <div className="py-4">
            <button
              onClick={() => (window.location.href = '/EmployeesList')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
              View All Employees
            </button>
          </div>
        )}
    </div>
  )}
</div>



   {/* Update Employee Role Section */}
   {/* <div className="mb-6 border-t border-gray-700 pt-4">
        <h2 className="text-xl font-semibold mb-2">Update Employee Role</h2>
        <select
          value={selectedEmployee.id}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, id: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
        <select
          value={selectedEmployee.newRoleId}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, newRoleId: e.target.value })}
          className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
        >
          <option value="">Select New Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateEmployeeRole}
          className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
        >
          Update Role
        </button>
      </div> */}
  

    </div>
    </div>
  );
  
  
}

export default DatabasePage;
