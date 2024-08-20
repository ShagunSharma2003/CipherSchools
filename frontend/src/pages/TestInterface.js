import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTestQuestions, submitTest } from '../utils/api';  // Import submitTest
import CameraFeed from '../components/Test/CameraFeed';
import Timer from '../components/Test/Timer';
//import { submitTest } from '../api/index';

const TestInterface = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetchTestQuestions(testId);
        const formattedQuestions = response.data.map((q) => ({ ...q, selectedOption: null }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    getQuestions();
  }, [testId]);

// Function to handle option selection for a question
const handleOptionSelect = (option) => {
  setQuestions(prevQuestions => 
    prevQuestions.map((q, idx) => 
      idx === currentQuestionIdx 
        ? { ...q, selectedOption: option } 
        : q
    )
  );
};


  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIdx(index);
  };

 // Function to submit the test
const handleSubmitTest = async () => {
  try {
    const answers = questions.map(q => q.selectedOption || 'Not Answered');
    console.log('Answers to be submitted:', answers);

    const response = await submitTest(testId, answers);

    setIsTestSubmitted(true);
    console.log('Test submitted successfully:', response);

    navigate('/test-result', { state: { score: response.data.score, questions } });
  } catch (error) {
    console.error('Error submitting test:', error);
  }
};
  
  
  
  

  const handleTimeUp = () => {
    alert('Time is up! Submitting the test.');
    handleSubmitTest();
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  if (isTestSubmitted) {
    return <div>Submitting your test...</div>;
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <CameraFeed />
      <Timer initialTime={10} onTimeUp={handleTimeUp} />
      <h2>
        Question {currentQuestionIdx + 1} of {questions.length}
      </h2>
      <p>{currentQuestion.question}</p>
      <div>
        {currentQuestion.options.map((option, idx) => (
          <div key={idx}>
            <label>
              <input
                type="radio"
                name={`question_${currentQuestion._id}`}
                value={option}
                checked={currentQuestion.selectedOption === option}
                onChange={() => handleOptionSelect(option)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrevious} disabled={currentQuestionIdx === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestionIdx === questions.length - 1}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
        <button onClick={handleSubmitTest} disabled={isTestSubmitted} style={{ marginLeft: '10px' }}>
          Submit Test
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Questions Palette</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => handleQuestionClick(idx)}
              style={{
                width: '40px',
                height: '40px',
                margin: '5px',
                backgroundColor: q.selectedOption ? '#4caf50' : '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
