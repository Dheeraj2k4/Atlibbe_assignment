const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { config } = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const questionRoutes = require('./routes/questionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Create reports directory if it doesn't exist
const reportsDir = path.join(__dirname, '..', process.env.PDF_STORAGE_PATH || './public/reports');
console.log('Reports directory path:', reportsDir);
if (!fs.existsSync(reportsDir)) {
  console.log('Reports directory does not exist, creating it...');
  fs.mkdirSync(reportsDir, { recursive: true });
  console.log('Reports directory created successfully');
} else {
  console.log('Reports directory already exists');
}

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB
connectDB().then(() => {
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});
