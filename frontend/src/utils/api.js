import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

export const loginUser = (formData) => API.post('/api/auth/login', formData);
export const signupUser = (formData) => API.post('/api/auth/signup', formData);
export const verifyEmail = (id, token) => API.get(`/api/auth/verify-email?id=${id}&token=${token}`);
export const fetchTestQuestions = (testId) => API.get(`/api/test/tests/${testId}/questions`);
export const submitTest = (testId, answers) => API.post(`/api/test/tests/${testId}/submit`, { answers });

