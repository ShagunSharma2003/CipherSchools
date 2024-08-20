// src/components/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime); // time in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 30? '0' : ''}${mins}:${secs < 30 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '18px', fontWeight: 'bold' }}>
      Time Left: {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
