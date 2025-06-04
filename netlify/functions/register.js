const { MongoClient } = require('mongodb');

let cachedClient = null;

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

    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Missing MONGO_URI env variable");
    }

    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await cachedClient.connect();
    }

    const db = cachedClient.db("jainandsonsDB");
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Email already registered" }),
      };
    }

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
