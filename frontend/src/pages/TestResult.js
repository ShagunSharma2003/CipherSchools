// // src/pages/TestResult.js
// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const TestResult = () => {
//   const location = useLocation();
//   const { questions } = location.state || { questions: [] };

//   const calculateScore = () => {
//     let score = 0;
//     questions.forEach((q) => {
//       if (q.selectedOption === q.answer) {
//         score += 1; // Assuming each question carries 1 mark
//       }
//     });
//     return score;
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Test Result</h2>
//       <p>Your Score: {calculateScore()} / {questions.length}</p>
//       <h3>Review Answers:</h3>
//       {questions.map((q, idx) => (
//         <div key={q.id} style={{ marginBottom: '15px' }}>
//           <p><strong>Question {idx + 1}:</strong> {q.question}</p>
//           <p><strong>Your Answer:</strong> {q.selectedOption || 'Not Answered'}</p>
//           <p><strong>Correct Answer:</strong> {q.answer}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TestResult;

import React from 'react';
import { useLocation } from 'react-router-dom';

const TestResult = () => {
  const location = useLocation();
  const { score, questions } = location.state || { score: null, questions: [] };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Submitted Successfully</h2>
      <p>Your test result will be generated and sent to your registered email address.</p>
      <h3>Review Answers:</h3>
      {questions.map((q, idx) => (
        <div key={q._id} style={{ marginBottom: '15px' }}>
          <p><strong>Question {idx + 1}:</strong> {q.question}</p>
          <p><strong>Your Answer:</strong> {q.selectedOption || 'Not Answered'}</p>
          <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
        </div>
      ))}
    </div>
  );
};

export default TestResult;
