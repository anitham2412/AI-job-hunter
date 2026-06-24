//import logo from './logo.svg';
//import './App.css';
//
//function App() {
//  return (
//    <div className="App">
//      <header className="App-header">
//        <img src={logo} className="App-logo" alt="logo" />
//        <p>
//          Edit <code>src/App.js</code> and save to reload.
//        </p>
//        <a
//          className="App-link"
//          href="https://reactjs.org"
//          target="_blank"
//          rel="noopener noreferrer"
//        >
//          Learn React
//        </a>
//      </header>
//    </div>
//  );
//}
//
//export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Register from './pages/Register';
import './index.css';
import Applications from './pages/Applications';

function App() {
    // Simple check — is user logged in?
    // (We store userId in localStorage after register)
    const userId = localStorage.getItem('userId');

    return (
        <BrowserRouter>
            <div className="app">
                {/* Show Navbar only if logged in */}
                {userId && <Navbar />}

                <div className="main-content">
                    <Routes>
                        {/* If not logged in → go to Register */}
                        <Route
                            path="/"
                            element={userId
                                ? <Navigate to="/dashboard" />
                                : <Navigate to="/register" />}
                        />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/register"  element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/jobs"      element={<Jobs />} />
                        <Route path="/jobs/:id"  element={<JobDetail />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
