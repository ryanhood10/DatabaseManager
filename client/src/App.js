import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DatabasePage from './pages/DatabasePage';
import HomePage from './pages/Homepage2';
import Header from './components/Header';
import Footer from './components/Footer';
import EmployeesListPage from './pages/EmployeesList';
import DepartmentsListPage from './pages/DepartmentsList';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* HomePage  */}
          <Route
            path="/"
            element={
              <React.Fragment>
                <Header/>
                <HomePage />
                <Footer />
              </React.Fragment>
            }
          />
          <Route
            path="/Database"
            element={
              <React.Fragment>
                                <Header/>
                <DatabasePage />
                <Footer />
              </React.Fragment>
            }
          />
           <Route
            path="/EmployeesList"
            element={
              <React.Fragment>
                                <Header/>
                <EmployeesListPage />
                <Footer />
              </React.Fragment>
            }
          />
           <Route
            path="/DepartmentsList"
            element={
              <React.Fragment>
                                <Header/>
                <DepartmentsListPage />
                <Footer />
              </React.Fragment>
            }
          />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
