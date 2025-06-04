const { MongoClient } = require('mongodb');

let cachedClient = null;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Connect to MongoDB
    const uri = process.env.MONGO_URI;
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db('jainandsonsDB'); // Use your actual DB name
    const users = db.collection('users');

    const user = await users.findOne({ email });

    return {
      statusCode: 200,
      body: JSON.stringify({ exists: !!user }),
    };

  } catch (err) {
    console.error('Error in check-user function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
