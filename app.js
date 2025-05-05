const dotenv = require('dotenv');
dotenv.config();  // Loads environment variables from .env
const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config/config');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Logging the API Key from environment variables
console.log("ENV API KEY:", process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://ambitious-sky-05446dd10.6.azurestaticapps.net'],
}));

app.use(express.json({ limit: config.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));

// Routes
app.use('/api', pdfRoutes);

// Health check route (works as a simple check to confirm backend)
app.get('/', (req, res) => {
  console.log("Received request at '/' endpoint");
  res.send('Backend is working!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Listen on dynamic port provided by Azure (process.env.PORT)
const port = process.env.PORT || 5000;  // Ensures Azure assigns the correct port dynamically
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
