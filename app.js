const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const config = require('./config/config');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

console.log("ENV API KEY:", process.env.GEMINI_API_KEY);

const apiKey = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));


app.use(express.json({ limit: config.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));

// Routes
app.use('/api', pdfRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Listen on port
const port = process.env.PORT || 5000;  // Ensure Azure can use its default port
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});

