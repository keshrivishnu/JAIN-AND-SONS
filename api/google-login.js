export default async function handler(req, res) {
  const origin = req.headers.origin;

  // ✅ Dynamically allow all Vercel frontend deployments
  if (origin?.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing token' });
  }

  // 👉 Continue your token verification or other logic here
  return res.status(200).json({ message: 'Login successful' });
}
