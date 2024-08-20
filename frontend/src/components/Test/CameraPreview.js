import React, { useState, useEffect, useRef } from 'react';

const CameraPreview = ({ onProceed }) => {
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [isProceedEnabled, setIsProceedEnabled] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsProceedEnabled(true); // Enable proceed button if permission is granted
      } catch (err) {
        setError('Camera permission denied. Test cannot be started.');
        setIsProceedEnabled(false); // Disable proceed button if permission is denied
      }
    };

    requestPermissions();

    // Cleanup stream on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline width="320" height="240" />
          <p>Test Time: 60 minutes</p>
          <p>Do not cheat. Do not use a calculator. Cheating is prohibited.</p>
          <button onClick={onProceed} disabled={!isProceedEnabled}>
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraPreview;
