import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://job-portal-nine-gules.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL.replace(/\/$/, ''))
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS Not Allowed'), false);
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interviews', interviewRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Nodemon trigger