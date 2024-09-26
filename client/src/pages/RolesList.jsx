import React, { useState, useEffect } from 'react';

function RolesListPage() {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isRolesListVisible, setIsRolesListVisible] = useState(true);
  const [newRole, setNewRole] = useState({ title: '', salary: '', departmentId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;
  const apiBaseUrl = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/roles`)
      .then((response) => response.json())
      .then((data) => setRoles(data));

    fetch(`${apiBaseUrl}/api/departments`)
      .then((response) => response.json())
      .then((data) => setDepartments(data));
  }, [apiBaseUrl]);

  const handleDeleteRole = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setRoles(roles.filter((role) => role.id !== id));
        setIsDeleteModalVisible(false);
      } else {
        console.error('Failed to delete the role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setIsDeleteModalVisible(false);
    }
  };

  const confirmDeleteRole = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalVisible(true);
  };

  const handleAddRole = () => {
    const rolePayload = {
      title: newRole.title,
      salary: newRole.salary,
      department_id: newRole.departmentId,
    };

    fetch(`${apiBaseUrl}/api/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rolePayload),
    })
      .then((response) => response.json())
      .then(() => {
        setNewRole({ title: '', salary: '', departmentId: '' });
        window.location.reload();
      })
      .catch((error) => console.error('Error adding role:', error));
  };

  const filteredRoles = roles.filter((role) =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment ? role.department_id === parseInt(selectedDepartment) : true)
  );

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
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

  const handleViewAll = () => {
    setIsRolesListVisible(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Roles List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List Section */}
        <div className="lg:col-span-2">
          <div className="relative h-[680px] w-[85%] mx-auto mb-4 bg-gray-700 rounded-md">
            <table className="min-w-full  bg-gray-800 border-2 border-gray-700 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-2 px-4">Role Title</th>
                  <th className="py-2 px-4">Salary</th>
                  <th className="py-2 px-4">Department</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto  align-top">
                {isRolesListVisible
                  ? currentRoles.map((role) => (
                      <tr key={role.id} className="border-t  border-gray-700">
                        <td className="py-2 px-4">{role.title}</td>
                        <td className="py-2 px-4">${role.salary}</td>
                        <td className="py-2 px-4">{role.department || 'N/A'}</td> {/* Correct display of department */}
                        <td className="py-2 px-4">
                          <button
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                            onClick={() => confirmDeleteRole(role)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : filteredRoles.map((role) => (
                      <tr key={role.id} className="border-t border-gray-700">
                        <td className="py-2 px-4">{role.title}</td>
                        <td className="py-2 px-4">${role.salary}</td>
                        <td className="py-2 px-4">{role.department || 'N/A'}</td> {/* Correct display of department */}
                        <td className="py-2 px-4">
                          <button
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                            onClick={() => confirmDeleteRole(role)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {isDeleteModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-[350px]">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Are you sure you want to delete this role?
                  </h3>
                  <p className="text-white mb-4">
                    Role: {roleToDelete?.title}, Salary: ${roleToDelete?.salary}, Department:{' '}
                    {roleToDelete?.department || 'N/A'}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteRole(roleToDelete.id)}
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

            {/* Pagination Controls */}
            {isRolesListVisible && (
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

                {/* View All Roles Button */}
                <span
                  className="absolute right-4 text-blue-500 hover:text-blue-400 cursor-pointer"
                  onClick={handleViewAll}
                >
                  View All Roles
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="flex flex-col space-y-4">
          {/* Search and Filter Section */}
          <aside className="lg:col-span-1 h-[250px] bg-gray-800 p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            <input
              type="text"
              placeholder="Search by Role Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-4 bg-gray-700 text-white"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </aside>

          {/* Add Role Section */}
          <aside className="lg:col-span-1 h-[260px] bg-gray-800 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Add Role</h2>
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
            <select
              value={newRole.departmentId}
              onChange={(e) => setNewRole({ ...newRole, departmentId: parseInt(e.target.value) })}
              className="border border-gray-600 rounded-md px-4 py-2 w-full mb-2 bg-gray-700 text-white"
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
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md w-full"
            >
              Add Role
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default RolesListPage;
