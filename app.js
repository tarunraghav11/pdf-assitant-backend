const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const pdfRoutes = require('./routes/pdfRoutes');
const userDataRoute = require('./routes/data');
const config = require('./config/config');

// ... your existing imports
const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: ['https://wonderful-hill-0e72acc1e.6.azurestaticapps.net']
}));
app.use(express.json({ limit: config.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/userdata', userDataRoute);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Serve static files and React frontend
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend is running on port ${port}`));
