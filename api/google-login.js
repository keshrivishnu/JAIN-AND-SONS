import admin from '../../lib/firebaseAdmin';

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'https://jain-and-sons-ufen.vercel.app',
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // handle preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body ?? (await getRawBody(req));
    const { idToken } = body;

    if (!idToken) {
      return res.status(400).json({ message: 'Missing idToken' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // You can get user info from decodedToken
    // e.g. decodedToken.uid, decodedToken.email, etc.

    return res.status(200).json({ message: 'Login successful', uid: decodedToken.uid });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Helper to parse raw JSON body if req.body is empty
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}
