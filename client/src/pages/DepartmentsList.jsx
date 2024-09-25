import React, { useState, useEffect } from 'react';

function DepartmentsListPage() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false); // State to toggle between paginated and full list display
  const departmentsPerPage = 10;
  const apiBaseUrl = 'http://localhost:3001';
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/departments`)
      .then((response) => response.json())
      .then((data) => setDepartments(data));
  }, [apiBaseUrl]);

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setDepartments(departments.filter((department) => department.id !== id));
        setIsDeleteModalVisible(false);
      } else {
        console.error('Failed to delete the department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      setIsDeleteModalVisible(false);
    }
  };

  const confirmDeleteDepartment = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalVisible(true);
  };

  // Filter departments based on the search term
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = showAll
    ? filteredDepartments // Show all departments when the button is pressed
    : filteredDepartments.slice().reverse().slice(indexOfFirstDepartment, indexOfLastDepartment);

  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);
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

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Departments List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Departments List Section */}
        <div className="lg:col-span-2">
          <div className="relative h-[650px] w-[85%] mx-auto mb-4 bg-gray-700 rounded-md">
            <table className="min-w-full bg-gray-800 border-2 border-gray-700 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-2 px-4">Department Name</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto align-top">
                {currentDepartments.map((department) => (
                  <tr key={department.id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{department.name}</td>
                    <td className="py-2 px-4 flex justify-end space-x-4">
                      <button
                        className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md"
                        onClick={() => confirmDeleteDepartment(department)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            {isDeleteModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-[350px]">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Are you sure you want to delete this department?
                  </h3>
                  <p className="text-white mb-4">Name: {departmentToDelete.name}</p>
                  <div className="flex justify-between">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteDepartment(departmentToDelete.id)}
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
            {!showAll && (
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
              </div>
            )}

            {/* View All Departments Button */}
            <span
              className="absolute right-4 bottom-4 text-blue-500 hover:text-blue-400 cursor-pointer"
              onClick={() => setShowAll(true)} // Toggle to show all departments
            >
              View All Departments
            </span>
          </div>
        </div>

        {/* Search Section */}
        <aside className="lg:col-span-1 h-[250px] bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Search Departments</h3>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-600 rounded-md px-4 py-2 w-full mb-4 bg-gray-700 text-white"
          />
        </aside>
      </div>
    </div>
  );
}

export default DepartmentsListPage;
