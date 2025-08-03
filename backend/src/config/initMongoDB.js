const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const Question = mongoose.model('Question');
const Report = mongoose.model('Report');

/**
 * Initialize MongoDB with sample data
 */
async function initMongoDB() {
  try {
    // Check if we already have data
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Database already has data, skipping initialization');
      return;
    }
    
    console.log('Initializing MongoDB with sample data...');
    
    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      company_name: 'Sample Company',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    // Create sample product
    const product = await Product.create({
      user: user._id,
      name: 'Organic Honey',
      description: 'Pure organic honey from wildflower meadows',
      category: 'Food',
      ingredients: 'Raw honey',
      manufacturing_process: 'Cold extraction, no heating',
      certifications: ['Organic', 'Non-GMO'],
      country_of_origin: 'New Zealand'
    });
    
    // Create sample questions
    await Question.create([
      {
        product: product._id,
        question_text: 'Are there any additives in this product?',
        answer: 'No, our honey is 100% pure with no additives or preservatives.',
        question_type: 'text',
        is_ai_generated: false
      },
      {
        product: product._id,
        question_text: 'What measures are taken to ensure bee welfare?',
        answer: 'We follow sustainable beekeeping practices, ensuring hives are not overharvested and bees have access to diverse, pesticide-free foraging areas.',
        question_type: 'text',
        is_ai_generated: true
      }
    ]);
    
    // Create sample report
    await Report.create({
      product: product._id,
      pdf_url: '/public/reports/product_1_report.pdf',
      feedback: 'Good transparency overall. Clear ingredient information provided.',
      areas_for_improvement: 'Could provide more details about the specific wildflower sources. Consider adding third-party verification of sustainability claims.'
    });
    
    console.log('MongoDB initialized with sample data');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
    throw error;
  }
}

module.exports = initMongoDB;