export default async function handler(req, res) {
    // ✅ Set CORS headers here
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://jain-and-sons-4sr1-oquhu39yo-keshrivishnus-projects.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // ✅ preflight
    }
  
    // Your logic
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Missing token" });
    }
  
    return res.status(200).json({ message: "Login successful" });
  }
  