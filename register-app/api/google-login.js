export default async function handler(req, res) {
    // ✅ Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://jain-and-sons-4sr1.vercel.app"); // 👈 your frontend domain
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // ✅ Respond to preflight
    }
  
    // ✅ Handle actual POST request
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ message: "Missing token" });
    }
  
    // You can verify the token with Firebase admin here (optional)
  
    return res.status(200).json({ message: "Login successful" });
  }
  