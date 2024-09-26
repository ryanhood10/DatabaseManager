import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function EmployeesListPage() {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', roleId: '' });
  const [sortConfig, setSortConfig] = useState(null); // Sorting configuration state
  const employeesPerPage = 10;
  const apiBaseUrl = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/roles`)
      .then((response) => response.json())
      .then((data) => setRoles(data));

    fetch(`${apiBaseUrl}/api/employees`)
      .then((response) => response.json())
      .then((data) => setEmployees(data));

    fetch(`${apiBaseUrl}/api/departments`)
      .then((response) => response.json())
      .then((data) => setDepartments(data));
  }, [apiBaseUrl]);

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setEmployees(employees.filter((employee) => employee.id !== id));
        setIsDeleteModalVisible(false);
      } else {
        console.error('Failed to delete the employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setIsDeleteModalVisible(false);
    }
  };

  const handleEditRoleClick = (employee) => {
    setEditingEmployeeId(employee.id);
    setSelectedRoleId(employee.role_id);
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setSelectedRoleId('');
  };

  const handleSaveRoleChange = (employeeId) => {
    fetch(`${apiBaseUrl}/api/employees/${employeeId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId: selectedRoleId }),
    })
      .then((response) => response.json())
      .then(() => {
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === employeeId
              ? { ...employee, role_id: parseInt(selectedRoleId) }
              : employee
          )
        );
        setEditingEmployeeId(null);
        setSelectedRoleId('');
      })
      .catch((error) => console.error('Error updating role:', error));
  };

  const handleAddEmployee = () => {
    fetch(`${apiBaseUrl}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then(() => {
        setNewEmployee({ firstName: '', lastName: '', roleId: '' });
        window.location.reload();
      });
  };

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

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortConfig !== null) {
      const roleA = roles.find((role) => role.id === a.role_id);
      const roleB = roles.find((role) => role.id === b.role_id);

      if (sortConfig.key === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      }

      if (sortConfig.key === 'role') {
        const roleTitleA = roleA?.title.toLowerCase() || '';
        const roleTitleB = roleB?.title.toLowerCase() || '';
        if (roleTitleA < roleTitleB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (roleTitleA > roleTitleB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      }

      if (sortConfig.key === 'salary') {
        const salaryA = parseFloat(roleA?.salary) || 0;
        const salaryB = parseFloat(roleB?.salary) || 0;
        return sortConfig.direction === 'ascending' ? salaryA - salaryB : salaryB - salaryA;
      }
    }
    return 0;
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

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

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const confirmDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalVisible(true);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      employees.map((employee) => ({
        Name: `${employee.first_name} ${employee.last_name}`,
        Role: roles.find((role) => role.id === employee.role_id)?.title || 'N/A',
        Salary: roles.find((role) => role.id === employee.role_id)?.salary || 'N/A',
        Department: departments.find((dept) => dept.id === roles.find((role) => role.id === employee.role_id)?.department_id)?.name || 'N/A',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'Employee_List.xlsx');
  };

  // Request sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      setSortConfig(null); // Reset sorting if already descending
      return;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Employee List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employee List Section */}
        <div className="lg:col-span-2">
          <div className="relative h-[680px] w-[85%] mx-auto mb-4 bg-gray-700 rounded-md">
            <table className="min-w-full bg-gray-800 border-2 border-gray-700 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-2 px-4">
                    Name
                    <span className="ml-2 cursor-pointer">
                      <button onClick={() => requestSort('name')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 9l-7.5 7.5L4.5 9"
                          />
                        </svg>
                      </button>
                      <button onClick={() => requestSort('name')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button onClick={() => setSortConfig(null)}>
                        -
                      </button>
                    </span>
                  </th>
                  <th className="py-2 px-4">
                    Role
                    <span className="ml-2 cursor-pointer">
                      <button onClick={() => requestSort('role')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 9l-7.5 7.5L4.5 9"
                          />
                        </svg>
                      </button>
                      <button onClick={() => requestSort('role')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button onClick={() => setSortConfig(null)}>
                        -
                      </button>
                    </span>
                  </th>
                  <th className="py-2 px-4">
                    Salary
                    <span className="ml-2 cursor-pointer">
                      <button onClick={() => requestSort('salary')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 9l-7.5 7.5L4.5 9"
                          />
                        </svg>
                      </button>
                      <button onClick={() => requestSort('salary')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 inline mx-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                      <button onClick={() => setSortConfig(null)}>
                        -
                      </button>
                    </span>
                  </th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto align-top">
                {currentEmployees.map((employee) => {
                  const role = roles.find((role) => role.id === employee.role_id);
                  const department = departments.find((dept) => dept.id === role?.department_id);

                  return (
                    <tr key={employee.id} className="border-t border-gray-700">
                      <td className="py-2 px-4">
                        {employee.first_name} {employee.last_name}
                      </td>
                      <td className="py-2 px-4">
                        {editingEmployeeId === employee.id ? (
                          <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white"
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.title}
                              </option>
                            ))}
                          </select>
                        ) : (
                          role?.title || 'N/A'
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {role?.salary ? `$${role.salary}` : 'N/A'}
                      </td>
                      <td className="py-2 px-4 flex justify-end space-x-4">
                        {editingEmployeeId === employee.id ? (
                          <>
                            <button
                              className="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded-md"
                              onClick={() => handleSaveRoleChange(employee.id)}
                            >
                              Save Changes
                            </button>
                            <button
                              className="bg-gray-500 hover:bg-gray-400 text-white px-2 py-1 rounded-md"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded-md"
                              onClick={() => handleEditRoleClick(employee)}
                            >
                              Edit Role
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md"
                              onClick={() => confirmDeleteEmployee(employee)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {isDeleteModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-[350px]">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Are you sure you want to delete this employee record?
                  </h3>
                  <p className="text-white mb-4">
                    Name: {employeeToDelete.first_name} {employeeToDelete.last_name}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteEmployee(employeeToDelete.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md"
                      onClick={() => setIsDeleteModalVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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

<div>
        {/* Search, Filter by Department, and Filter by Role Section */}
        <aside className="lg:col-span-1 h-[250px] bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-600 rounded-md px-4 py-2 w-full mb-4 bg-gray-700 text-white"
          />
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
          <div className="py-2 justify-end">
            <button
              onClick={exportToExcel}
              className="flex items-center bg-transparent text-green-500 border border-green-500 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-md mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3zm4.875 12.75l4.5-4.5-4.5-4.5M11.25 8.25h4.5M11.25 15.75h4.5"
                />
              </svg>
              Export to Excel
            </button>
          </div>
        </aside>

        {/* Add Employee Section */}
        <aside className="lg:col-span-1 h-[260px] bg-gray-800 p-4 rounded-md shadow-md mt-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Add Employee</h2>
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
          <select
            value={newEmployee.roleId}
            onChange={(e) => setNewEmployee({ ...newEmployee, roleId: e.target.value })}
            className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
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
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md"
          >
            Add Employee
          </button>
        </aside>
        </div> 
      </div>
    </div>
  );
}

export default EmployeesListPage;
