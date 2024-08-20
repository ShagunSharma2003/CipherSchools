// const express = require('express');
// const mongoose = require('mongoose');
// const sendEmail = require('../utils/mailer');
// const Test = require('../models/Test');
// const auth = require('../middleware/auth');

// const router = express.Router();

// router.post('/send-score', async (req, res) => {
//   try {
//     await sendEmail('anandgu2002@gmail.com', 'Test Results', '<h1>Your score is: 85%</h1>');
//     res.status(200).json({ message: 'Score email sent' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending score email' });
//   }
// });
// //fetch the available tests for dashboard
// router.get('/tests', auth, async (req, res) => {
//   try {
//     const tests = await Test.find();
//     res.json(tests);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tests' });
//   }
// });


// // Fetch questions for a specific test
// router.get('/tests/:id/questions', auth, async (req, res) => {
  
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: 'Invalid test ID' });
//   }

//   try {
//     const test = await Test.findById(req.params.id);
//     if (!test) {
//       return res.status(404).json({ message: 'Test not found' });
//     }
//     res.json(test.questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching questions' });
//   }
// });

// // Submit test answers
// router.post('/tests/:id/submit', auth, async (req, res) => {
//   console.log('Test submission route hit'); 
//   const { answers } = req.body;
//   const userId = req.user.id;
//   const testId = req.params.id;

//   console.log(`Received request to submit test. Test ID: ${testId}, User ID: ${userId}`);

//   try {
//     const test = await Test.findById(testId);
//     if (!test) {
//       console.error('Test not found for ID:', testId);
//       return res.status(404).json({ message: 'Test not found' });
//     }

//     const score = calculateScore(test.questions, answers);
//     console.log('Test score calculated:', score);

//     const user = req.user;
//     const emailContent = `
//       <h1>Thank you for taking the test, ${user.name}!</h1>
//       <p>Your test titled "${test.title}" has been successfully submitted.</p>
//       <p>Your Score: ${score} / ${test.questions.length}</p>
//       <p>We appreciate your efforts and wish you the best in your future endeavors.</p>
//     `;
//     await sendEmail(user.email, 'Your Test Results', emailContent);
//     console.log(`Score email sent to ${user.email}`);

//     res.status(200).json({ message: 'Test submitted successfully. Your score will be sent to your registered email.', score });
//   } catch (error) {
//     console.error('Error submitting test:', error);
//     res.status(500).json({ message: 'Error submitting test' });
//   }
// });




// const calculateScore = (questions, answers) => {
//   let score = 0;
//   questions.forEach((question, index) => {
//     if (question.correctAnswer === answers[index]) {
//       score += 1; // Assuming each question is worth 1 point
//     }
//   });
//   return score;
// };


// module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const sendEmail = require('../utils/mailer');
const Test = require('../models/Test');
const auth = require('../middleware/auth');

const router = express.Router();

// Fetch available tests for dashboard
router.get('/tests', auth, async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// Fetch questions for a specific test
router.get('/tests/:id/questions', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid test ID' });
  }

  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test.questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Submit test answers
router.post('/tests/:id/submit', auth, async (req, res) => {
  console.log('Test submission route hit');
  
  const { answers } = req.body;
  const userId = req.user.id;
  const testId = req.params.id;

  console.log(`Received request to submit test. Test ID: ${testId}, User ID: ${userId}`);

  try {
    const test = await Test.findById(testId);
    if (!test) {
      console.error('Test not found for ID:', testId);
      return res.status(404).json({ message: 'Test not found' });
    }

    const score = calculateScore(test.questions, answers);
    console.log('Test score calculated:', score);

    const user = req.user;
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const emailContent = `
      <h1>Thank you for taking the test, ${user.name || 'User'}!</h1>
      <p>Your test titled "${test.title}" has been successfully submitted.</p>
      <p>Your Score: ${score} / ${test.questions.length}</p>
      <p>We appreciate your efforts and wish you the best in your future endeavors.</p>
    `;
    await sendEmail(user.email, 'Your Test Results', emailContent);
    console.log(`Score email sent to ${user.email}`);

    res.status(200).json({ message: 'Test submitted successfully. Your score will be sent to your registered email.', score });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Error submitting test' });
  }
});

const calculateScore = (questions, answers) => {
  let score = 0;
  questions.forEach((question, index) => {
    console.log(`Question: ${question.question}`);
    console.log(`Correct Answer: ${question.correctAnswer}`);
    console.log(`User's Answer: ${answers[index]}`);

    if (String(question.correctAnswer).trim() === String(answers[index]).trim()) {
      score += 1;
      console.log('Answer is correct. Incrementing score.');
    } else {
      console.log('Answer is incorrect.');
    }
  });

  console.log('Final Score:', score);
  return score;
};



module.exports = router;
