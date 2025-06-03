export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (origin && origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight response
  }

  let body = '';

  // Collect and parse body (for serverless function)
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { idToken } = JSON.parse(body);
      if (!idToken) {
        return res.status(400).json({ message: 'Missing token' });
      }

      return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON body' });
    }
  });
}
