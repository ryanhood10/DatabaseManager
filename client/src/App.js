import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DatabasePage from './pages/Homepage';

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Router>
        <Routes>
          {/* HomePage  */}
          <Route
            path="/"
            element={
              <React.Fragment>
                <DatabasePage />
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
