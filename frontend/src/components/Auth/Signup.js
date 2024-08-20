import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../utils/api';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // Changed from error to message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    console.log('Signup attempt:', { name, email, password });

    try {
      const response = await signupUser({ name, email, password });
      console.log('Signup successful:', response.data);
      setMessage(response.data.message);
    } catch (err) {
      if (err.response) {
        console.error('Signup failed - Server response:', err.response.data);
        console.error('Status code:', err.response.status);
        setMessage(err.response.data.message || 'Signup failed.');
      } else if (err.request) {
        console.error('Signup failed - No response received:', err.request);
        setMessage('No response from server. Please try again later.');
      } else {
        console.error('Signup failed - Error during request setup:', err.message);
        setMessage('An error occurred during signup.');
      }
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
