import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../utils/api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      const id = searchParams.get('id');
      const token = searchParams.get('token');

      if (!id || !token) {
        setStatus('Invalid verification link.');
        return;
      }

      try {
        const response = await verifyEmail(id, token);
        setStatus(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        if (error.response) {
          setStatus(error.response.data.message || 'Verification failed.');
        } else {
          setStatus('An error occurred during verification.');
        }
      }
    };

    verifyUserEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default EmailVerification;
