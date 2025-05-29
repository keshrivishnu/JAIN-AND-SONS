// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const firebaseAdmin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const app = express();


// ✅ CORS setup - place this BEFORE your routes
app.use(cors({
  origin: 'http://127.0.0.1:5500', // must match your frontend origin exactly
  credentials: true
}));


app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false // true only if using HTTPS
  }
}));

// // ✅ CORS Setup (correct way)
// app.use(cors({
//   origin: 'http://localhost:5173', // 🔁 Replace with your actual frontend port
//   credentials: true
// }));

// ✅ Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ✅ Debugging session (optional)
app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  next();
});

// ✅ Firebase Admin Initialization
const serviceAccount = require("C:\\Users\\vishn\\Desktop\\JAIN AND SONS\\config\\jainandsons-3b31c-firebase-adminsdk-fbsvc-94984c74b2.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// ✅ MongoDB Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jain-and-sons';
console.log(`Connecting to MongoDB at: ${dbURI}`);

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Stack:', err.stack);
  });

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ✅ Register Route
app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const newUser = new User({ name, email, phone });
    await newUser.save();
    req.session.user = newUser;

    res.status(200).json({ message: 'User registered successfully', redirect: '/home' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Email and phone are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.phone !== phone) {
      return res.status(400).json({ error: 'Invalid email or phone' });
    }

    req.session.user = user;
    res.status(200).json({ message: 'Login successful', redirect: '/home' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully', redirect: '/' });
  });
});

// ✅ Home Route (protected)
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      message: `Welcome, ${req.session.user.name}`,
      user: req.session.user
    });
  } else {
    res.status(401).json({ message: 'Please login first' });
  }
});

// ✅ Update Profile Route (protected)
app.post('/update-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  const { name, email, phone } = req.body;
  const userId = req.session.user._id;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, phone }, { new: true });
    req.session.user = updatedUser;
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ////////////////


// ✅ Enable CORS for frontend
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
  }));
  
  // ✅ Parse JSON
  app.use(express.json());
  
  // ✅ Set up session middleware
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

// ✅ Google Login Route
app.post('/google-login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;
    const name = decodedToken.name || 'User';

    if (!decodedToken.email_verified) {
      return res.status(400).json({ error: 'Email not verified with Google' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, phone: '' });
      await user.save();
    }

    req.session.user = user;
    res.status(200).json({ message: 'Login successful', redirect: '/home' });
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

// ✅ Check User Before Registering
app.post('/check-user', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Catch-All 404
app.use('*', (req, res) => {
    origin: 'http://127.0.0.1:5500', 
    // credentials: true
     
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/register.html'); // or send unauthorized
}
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
