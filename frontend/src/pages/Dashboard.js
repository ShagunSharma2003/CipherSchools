import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // Import your axios instance

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data after login
    const fetchUserData = async () => {
      try {
        const response = await API.get('/api/auth/user');
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch all test details
    const fetchAllTests = async () => {
      try {
        const response = await API.get('/api/test/tests');
        setTests(response.data); // Store the list of tests in state
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchUserData();
    fetchAllTests();
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/environment-check/${testId}`); // Pass the test ID to the environment check page
  };

  return (
    <div>
      <h1>Hello, {userName}!</h1>
      <h2>Available Tests:</h2>
      <ul>
        {tests.map(test => (
          <li key={test._id}>
            <h3>{test.title}</h3>
            <p>{test.description}</p>
            <p>{test.questions.length} Questions | {test.duration} Minutes | {test.marks} Marks</p>
            <button onClick={() => handleStartTest(test._id)}>Start Test</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
