// src/components/CameraFeed.js
import React, { useEffect, useRef } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <video ref={videoRef} autoPlay playsInline width="150" height="100" style={{ borderRadius: '8px', border: '2px solid #000' }} />
    </div>
  );
};

export default CameraFeed;
