const mongoose = require('mongoose');
const { config } = require('dotenv');

// Load environment variables
config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transparency_portal';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Close the Mongoose connection if the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = {
  connectDB,
  mongoose
};