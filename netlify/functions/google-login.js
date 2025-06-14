exports.handler = async (event, context) => {
    const origin = event.headers.origin;
  
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'https://polite-klepon-205471.netlify.app',
      'https://jainsonspatna.com',
      'https://www.jainsonspatna.com'
    ];
  
    if (!origin || allowedOrigins.includes(origin)) {
      // continue
    } else {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({ message: 'CORS policy does not allow access from your origin.' }),
      };
    }
  
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: '',
      };
    }
  
    try {
      const body = JSON.parse(event.body);
      const { idToken } = body;
  
      if (!idToken) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Credentials': 'true',
          },
          body: JSON.stringify({ message: 'Missing token' }),
        };
      }
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({ message: 'Login successful' }), // ✅ Valid JSON
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({ message: 'Invalid JSON body' }), // ✅ Valid JSON
      };
    }
  };
  