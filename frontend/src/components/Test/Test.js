import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get('/api/test/questions');
      setQuestions(res.data);
      setAnswers(new Array(res.data.length).fill(null));
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

  const submitTest = async () => {
    try {
      await axios.post('/api/test/submit', { answers });
      window.location.href = '/finish-test';
    } catch (error) {
      console.error('Submission Error:', error);
    }
  };

  return (
    <div>
      {questions.map((question, index) => (
        <Question key={index} question={question} onAnswerChange={(answer) => handleAnswerChange(index, answer)} />
      ))}
      <button onClick={submitTest}>Submit Test</button>
    </div>
  );
};

export default Test;
