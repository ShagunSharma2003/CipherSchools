// // src/components/Auth/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../../utils/api';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     console.log('Login attempt:', { email, password });

  //   try {
  //     const res = await loginUser({ email, password });
  //     console.log('Login successful:', res.data);
  //     localStorage.setItem('token', res.data.token);
  //     navigate('/dashboard');  // Redirect to the dashboard after successful login
  //   } catch (err) {
  //     if (err.response) {
  //       console.error('Login failed - Server response:', err.response.data);
  //       console.error('Status code:', err.response.status);
  //       setError(err.response.data.message || 'Login failed.');
  //     } else if (err.request) {
  //       console.error('Login failed - No response received:', err.request);
  //       setError('No response from server. Please try again later.');
  //     } else {
  //       console.error('Login failed - Error during request setup:', err.message);
  //       setError('An error occurred during login.');
  //     }
  //   }
  // };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');  // Redirect to the dashboard after successful login
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed.');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
