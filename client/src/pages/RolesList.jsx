import React, { useState, useEffect } from 'react';

function RolesListPage() {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isRolesListVisible, setIsRolesListVisible] = useState(true);
  const [newRole, setNewRole] = useState({ title: '', salary: '', departmentId: '' });
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
    fetch(`${apiBaseUrl}/api/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRole),
    })
      .then((response) => response.json())
      .then(() => {
        setNewRole({ title: '', salary: '', departmentId: '' });
        window.location.reload();
      });
  };

  const toggleRolesListVisibility = () => {
    setIsRolesListVisible(!isRolesListVisible);
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Roles List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List Section */}
        <div className="lg:col-span-2">
          <div className="relative h-[650px] w-[85%] mx-auto mb-4 bg-gray-700 rounded-md">
            <p
              className="text-blue-500 hover:text-blue-400 cursor-pointer mb-4"
              onClick={toggleRolesListVisibility}
            >
              {isRolesListVisible ? 'Hide Roles List' : 'View Roles List'}
            </p>

            {isRolesListVisible && (
              <>
                <table className="min-w-full bg-gray-800 border-2 border-gray-700 rounded-md shadow-sm">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4">Role Title</th>
                      <th className="py-2 px-4">Salary</th>
                      <th className="py-2 px-4">Department</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto align-top">
                    {roles.map((role) => (
                      <tr key={role.id} className="border-t border-gray-700">
                        <td className="py-2 px-4">{role.title}</td>
                        <td className="py-2 px-4">${role.salary}</td>
                        <td className="py-2 px-4">
                          {departments.find((department) => department.id === role.departmentId)?.name || 'N/A'}
                        </td>
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
                        Role: {roleToDelete?.title}, Salary: ${roleToDelete?.salary}, Department: {departments.find((department) => department.id === roleToDelete?.departmentId)?.name || 'N/A'}
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

                {/* Conditionally render the "View All Roles" button if there are more than 10 roles */}
                {roles.length > 10 && (
                  <div className="py-4">
                    <button
                      onClick={() => setIsRolesListVisible(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                      View All Roles
                    </button>
                  </div>
                )}

                <p className="text-red-500 text-end pr-4">
                  ** You may not delete Roles that are currently assigned to an employee! **
                </p>
              </>
            )}
          </div>
        </div>

        {/* Add Role Section */}
        <aside className="lg:col-span-1 h-[250px] bg-gray-800 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Role</h2>
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
            onChange={(e) => setNewRole({ ...newRole, departmentId: e.target.value })}
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
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md"
          >
            Add Role
          </button>
        </aside>
      </div>
    </div>
  );
}

export default RolesListPage;
