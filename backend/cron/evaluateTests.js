// backend/cron/evaluateTests.js
const cron = require('node-cron');
const Test = require('../models/Test');
const sendEmail = require('../utils/mailer');

// Run the cron job every hour
cron.schedule('0 * * * *', async () => {
    try {
        const tests = await Test.find();
        tests.forEach(async test => {
            test.submissions.forEach(async submission => {
                if (!submission.score) {
                    // Evaluate the score
                    let score = 0;
                    test.questions.forEach((question, index) => {
                        if (submission.answers[index] === question.correctAnswer) {
                            score += 1;
                        }
                    });

                    // Update the score
                    submission.score = (score / test.questions.length) * 100;
                    await test.save();

                    // Send the result email
                    const emailContent = `<h1>Your score is: ${submission.score}%</h1>`;
                    await sendEmail(submission.user.email, 'Test Results', emailContent);
                }
            });
        });
        console.log('Test evaluations completed');
    } catch (err) {
        console.error('Error evaluating tests:', err);
    }
});
