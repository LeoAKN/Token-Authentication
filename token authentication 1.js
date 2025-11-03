import express from 'express';
const app = express();

// Logging middleware
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`${req.method} ${req.url} ${time}`);
  next();
});

// Token auth middleware
const checkToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = header.split(' ');
  if (parts[0] !== 'Bearer' || parts[1] !== 'mysecrettoken') {
    return res.status(403).json({ error: 'Invalid token' });
  }
  next();
};

// Public route
app.get('/public', (req, res) => {
  res.json({ message: 'Public access granted' });
});

// Protected route
app.get('/protected', checkToken, (req, res) => {
  res.json({ message: 'Protected access granted' });
});

app.listen(3000, () => console.log('Server running'));
