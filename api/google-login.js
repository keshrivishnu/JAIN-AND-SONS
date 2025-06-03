// pages/api/google-login.js (in your backend repo)

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // Allow any Vercel preview deployment or production site
  if (origin && origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Respond to preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing token' });
  }

  return res.status(200).json({ message: 'Login successful' });
}
