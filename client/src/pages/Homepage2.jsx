import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-900 text-gray-300">
      <div className="max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg text-center">
        
      <h1 className="text-3xl font-bold text-cyan-500">Database Manager</h1>
        <p className="mb-4">
          This app is used to update and manage our database on the cloud.
          <br></br> For internal use only.
        </p>
        
        <div className="mb-6">
          <Link to="/Database" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Enter the App
          </Link>
        </div>
        {/* <p>
          Please read our{' '}
          <Link to="/BestPractices" className="text-cyan-500 underline">
            Best Practices
          </Link>{' '}
          page for best video capturing practices.
        </p> */}
      </div>
    </div>
  );
};

export default HomePage;
