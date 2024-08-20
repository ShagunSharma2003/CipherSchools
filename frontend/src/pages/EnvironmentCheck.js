import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const EnvironmentCheck = () => {
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { testId } = useParams(); // Get the testId from the route params

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Camera permission denied. Test cannot be started.');
      }
    };

    requestPermissions();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleProceed = () => {
    if (!error) {
      navigate(`/test/${testId}`); // Navigate to the test interface with the test ID
    }
  };

  return (
    <div>
      <h2>Environment Check</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline width="320" height="240" />
          <p>Please ensure that your camera is functioning properly.</p>
        </div>
      )}

      {/* Test Instructions */}
      <div>
        <h3>Test Instructions</h3>
        <ul>
          <li>You can navigate between the questions.</li>
          <li>Sit in a well-lit environment.</li>
          <li>Uphold honesty and integrity while taking the test.</li>
          <li>Do not switch windows during the test.</li>
        </ul>
      </div>
      
      <br />
      <button onClick={handleProceed} disabled={!!error}>Proceed</button>
    </div>
  );
};

export default EnvironmentCheck;
