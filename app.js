const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const pdfRoutes = require('./routes/pdfRoutes');
const userDataRoute = require('./routes/data');
const config = require('./config/config');

const app = express();

connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://pdf-assistant-frontend.onrender.com'],
}));
app.use(express.json({ limit: config.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));

console.log("ENV API KEY:", process.env.GEMINI_API_KEY);

app.use('/api/auth', authRoutes);       // Login/Register
app.use('/api/pdf', pdfRoutes);         // PDF upload & processing
app.use('/api/userdata', userDataRoute);// Saving/retrieving user data

app.get('/', (req, res) => res.send('Backend is working!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend is running on port ${port}`));
