export default async function handler(req, res) {
  const origin = req.headers.origin;

  // Allow non-browser tools (no origin) and specific allowed origins
  if (!origin || origin === 'http://127.0.0.1:5500' ||
      origin === 'https://jain-and-sons-374p.vercel.app' ||
      origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Block disallowed origins
    return res.status(403).json({ message: 'CORS policy does not allow access from your origin.' });
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your normal API logic here
  try {
    const body = req.body ?? await getBody(req);
    const { idToken } = body;

    if (!idToken) {
      return res.status(400).json({ message: 'Missing token' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
}

async function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
}
