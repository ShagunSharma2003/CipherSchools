// src/api/index.js

import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

// Attach the token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

// Function to submit test
export const submitTest = async (testId, answers) => {
  try {
    console.log(`Submitting test with ID: ${testId} and answers:`, answers);
    const response = await API.post(`/api/test/tests/${testId}/submit`, { answers });
    console.log('Test submission successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting test:', error.response ? error.response.data : error.message);
    throw error;
  }
};
