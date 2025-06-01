export default async function handler(req, res) {
    const origin = req.headers.origin;
    const baseDomain = "https://jain-and-sons-4sr1";
  
    // ✅ Allow the base domain and any preview domain under the same project
    if (origin && origin.startsWith(baseDomain)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Missing token" });
    }
  
    return res.status(200).json({ message: "Login successful" });
  }
  