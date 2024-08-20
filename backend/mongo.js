const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Connection URL and Database Name with environment variables
const uri = process.env.MONGO_URI; // Replace with your actual MongoDB connection URI
const dbName = 'test';

// Test ID to check
const testId = '66c1e69c863061224d1b7d35';

async function checkTestId() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to server');

    // Select the database
    const db = client.db(dbName);

    // Select the collection
    const collection = db.collection('tests');

    // Check if the test with the specific ID exists (using correct syntax)
    const test = await collection.findOne({ _id: new ObjectId(testId) });

    if (test) {
      console.log('Test found:', test);
    } else {
      console.log('Test not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.close();
  }
}

checkTestId();