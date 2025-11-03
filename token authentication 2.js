import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = 'bankkey';
let balance = 1000;

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'user' || password !== 'pass') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

// Auth middleware
const verifyJWT = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const [type, token] = header.split(' ');
  if (type !== 'Bearer') return res.status(400).json({ error: 'Malformed header' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Protected routes
app.get('/balance', verifyJWT, (req, res) => {
  res.json({ balance });
});

app.post('/deposit', verifyJWT, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  balance += amount;
  res.json({ balance });
});

app.post('/withdraw', verifyJWT, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (amount > balance) return res.status(400).json({ error: 'Insufficient funds' });
  balance -= amount;
  res.json({ balance });
});

app.listen(3000);
