import React from 'react';

const Question = ({ question, onAnswerChange }) => {
  const handleChange = (e) => {
    onAnswerChange(e.target.value);
  };

  return (
    <div>
      <h2>{question.questionText}</h2>
      {question.options.map((option, index) => (
        <div key={index}>
          <input type="radio" name="option" value={option} onChange={handleChange} />
          {option}
        </div>
      ))}
    </div>
  );
};

export default Question;
