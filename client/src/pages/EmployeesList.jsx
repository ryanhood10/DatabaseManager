import React, { useState, useEffect } from 'react';

function EmployeesListPage() {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({ id: '', newRoleId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState([]);
  const employeesPerPage = 10;
  const apiBaseUrl = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/roles`)
      .then((response) => response.json())
      .then((data) => setRoles(data));

    fetch(`${apiBaseUrl}/api/employees`)
      .then((response) => response.json())
      .then((data) => setEmployees(data));
  }, [apiBaseUrl]);

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setEmployees(employees.filter((employee) => employee.id !== id));
      } else {
        console.error('Failed to delete the employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdateEmployeeRole = () => {
    fetch(`${apiBaseUrl}/api/employees/${selectedEmployee.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId: selectedEmployee.newRoleId }),
    })
      .then((response) => response.json())
      .then(() => {
        setSelectedEmployee({ id: '', newRoleId: '' });
        window.location.reload();
      });
  };

  // Filter employees based on search term, selected department, and selected role
  const filteredEmployees = employees
    .filter((employee) => {
      const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .filter((employee) => {
      if (!selectedDepartment) return true;
      const role = roles.find((role) => role.id === employee.role_id);
      return role && role.departmentId === parseInt(selectedDepartment, 10);
    })
    .filter((employee) => {
      if (!selectedRole) return true;
      return employee.role_id === parseInt(selectedRole, 10);
    });

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees
    .slice()
    .reverse()
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Function to change page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Employee List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Employee List Section */}
<div className="lg:col-span-2">
  <div className="relative h-[650px] w-[80%] mx-auto mb-4 bg-gray-700 rounded-md">
    <table className="min-w-full bg-gray-800 border-2 border-gray-700 rounded-md shadow-sm">
      <thead>
        <tr className="bg-gray-700">
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Role</th>
          <th className="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="h-[550px] overflow-y-auto align-top">
        {/* Ensure rows start at the top of the table */}
        {currentEmployees.map((employee) => (
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

    {/* Fixed Pagination Controls */}
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-4 bg-gray-800 border-t border-gray-700">
      <div className="flex space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? 'bg-gray-600'
              : 'bg-blue-500 hover:bg-blue-400 text-white'
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded-md ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage >= totalPages
              ? 'bg-gray-600'
              : 'bg-blue-500 hover:bg-blue-400 text-white'
          }`}
        >
          Next
        </button>
      </div>

      {/* View All Employees Button */}
      <span
        className="absolute right-4 text-blue-500 hover:text-blue-400 cursor-pointer"
        onClick={() => (window.location.href = '/EmployeesList')}
      >
        View All Employees
      </span>
    </div>
  </div>
</div>




        {/* Edit Employee Role and Search/Filter Section */}
        <aside className="lg:col-span-1 w-[70%] h-[70%] bg-gray-800 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Update Employee Role
          </h2>
          <select
            value={selectedEmployee.id}
            onChange={(e) =>
              setSelectedEmployee({ ...selectedEmployee, id: e.target.value })
            }
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
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                newRoleId: e.target.value,
              })
            }
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
            className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md w-full"
          >
            Update Role
          </button>

          {/* Search, Filter by Department, and Filter by Role Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Search & Filter</h3>
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-4 bg-gray-700 text-white"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
            >
              <option value="">Filter by Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
            >
              <option value="">Filter by Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EmployeesListPage;
