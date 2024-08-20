const mongoose = require('mongoose');
const Test = require('../models/Test');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dsaTest = new Test({
  title: 'Data Structures & Algorithms',
  topic: 'DSA', // Add a new field for topic
  description: 'A test covering basic concepts in Data Structures & Algorithms.',
  duration: 10, // Set duration to 10 minutes
  marks: 5, // Set total marks to 5 (1 mark per question)
  questions: [
    {
      question: 'What is the difference between an array and a linked list?',
      options: [
        'Arrays are fixed-size, linked lists are dynamic',
        'Arrays can store any data type, linked lists can only store integers',
        'Arrays are faster for random access, linked lists are faster for insertions/deletions',
        'All of the above'
      ],
      correctAnswer: 'All of the above'
    },
    {
      question: 'What is a time complexity of a linear search algorithm?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswer: 'O(n)'
    },
    {
      question: 'What is the purpose of a binary search tree?',
      options: [
        'Efficiently search for data in a sorted order',
        'Organize data in a hierarchical structure',
        'Store key-value pairs',
        'All of the above'
      ],
      correctAnswer: 'Efficiently search for data in a sorted order'
    },
    {
      question: 'What is the difference between a stack and a queue?',
      options: [
        'Stacks follow LIFO (Last In First Out), queues follow FIFO (First In First Out)',
        'Stacks are used for function calls, queues are used for processing tasks',
        'Stacks can only store integers, queues can store any data type',
        'There is no difference'
      ],
      correctAnswer: 'Stacks follow LIFO (Last In First Out), queues follow FIFO (First In First Out)'
    },
    {
      question: 'What is the time complexity of a bubble sort algorithm?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswer: 'O(n^2)'
    }
  ]
});

dsaTest.save()
  .then(() => {
    console.log('DSA Test saved successfully!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error saving test:', error);
    mongoose.connection.close();
  });