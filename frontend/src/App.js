import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import EmailVerification from './pages/EmailVerification';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import EnvironmentCheck from './pages/EnvironmentCheck';
import TestInterface from './pages/TestInterface'; 
import TestResult from './pages/TestResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/test-result" element={<ProtectedRoute element={<TestResult />} />} />
        <Route path="/environment-check/:testId" element={<ProtectedRoute element={<EnvironmentCheck />} />} />
        <Route path="/test/:testId" element={<ProtectedRoute element={<TestInterface />} />} />
      </Routes>
    </Router>
  );
}

export default App;


{/* <Route path="/dashboard" element={<Dashboard />} />
<Route path="/environment-check"  element={<EnvironmentCheck />}  />
<Route path="/test" element={<TestInterface />}  />
<Route path="/test-result" element={<TestResult />}  /> */}