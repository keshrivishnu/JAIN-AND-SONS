const { MongoClient } = require('mongodb');

let cachedClient = null; // To reuse the client in future calls

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Allow": "POST" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone } = data;

    // Validate input
    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Connect to MongoDB
    const uri = process.env.MONGO_URI;
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }

    const db = cachedClient.db("jainandsons"); // Use your DB name
    const users = db.collection("users");

    // Optional: Check if email already exists (for safety)
    const existing = await users.findOne({ email });
    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Email already registered" }),
      };
    }

    // Insert new user
    await users.insertOne({ name, email, phone });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registration successful" }),
    };

  } catch (err) {
    console.error("Error in register function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
