const allowedOrigins = [
    'https://jain-and-sons-4sr1.vercel.app',
    'https://jain-and-sons-4sr1-hya7yz9q9-keshrivishnus-projects.vercel.app', // add all preview domains you use
  ];
  
  export default async function handler(req, res) {
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // respond to preflight
    }
  
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ message: 'Missing token' });
    }
  
    return res.status(200).json({ message: 'Login successful' });
  }
  