const mongoose = require('mongoose');
const { config } = require('dotenv');
const initMongoDB = require('./initMongoDB');

// Load environment variables
config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transparency_portal';

const initializeDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully!');
    
    // Initialize with sample data
    await initMongoDB();
    
    console.log('Database initialization complete!');
    
    // Close the connection
    await mongoose.connection.close();
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase();