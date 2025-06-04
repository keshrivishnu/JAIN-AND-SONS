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
  
      // Validate the data (optional but recommended)
      if (!name || !email || !phone) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }
  
      // Here, add your database logic to save the user
      // Example: save user to your DB (Firebase, MongoDB, etc)
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Registration successful" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  };
  