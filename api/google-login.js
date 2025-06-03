export default async function handler(req, res) {
  const origin = req.headers.origin;

  // ✅ Allow requests from any vercel.app subdomain (preview + production)
  if (origin && origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ✅ Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body ?? await getBody(req);
    const { idToken } = body;

    if (!idToken) {
      return res.status(400).json({ message: 'Missing token' });
    }

    // ✅ Optional: You can verify the token here using Firebase Admin SDK
    // For example:
    // const decodedToken = await admin.auth().verifyIdToken(idToken);

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error("Error parsing request:", err);
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
}

// 🔧 Helper to parse raw body manually (Vercel doesn't auto-parse JSON)
async function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
}
