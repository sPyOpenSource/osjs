const express = require('express');
const path = require('path');
const filesRouter = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api', filesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`jsOS server running on http://localhost:${PORT}`);
});