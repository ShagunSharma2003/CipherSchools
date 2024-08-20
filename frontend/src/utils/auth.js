//utils/auth.js
import jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = jwtDecode(token);
  return decodedToken.exp * 1000 > Date.now();
};
