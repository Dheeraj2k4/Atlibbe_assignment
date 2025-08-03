const mongoose = require('mongoose');

// Define the schema
const questionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // this should match the model name from productModel.js
    required: true
  },
  question_text: { type: String, required: true },
  answer: { type: String },
  question_type: { type: String, default: 'text' },
  is_ai_generated: { type: Boolean, default: false }
});

// Create the model
const Question = mongoose.model('Question', questionSchema);

// Export methods using the model
module.exports = {
  model: Question, // in case you need direct access to the model

  async create(questionData) {
    try {
      const question = new Question({
        product: questionData.product || questionData.product_id, // support both keys
        question_text: questionData.question_text,
        answer: questionData.answer,
        question_type: questionData.question_type || 'text',
        is_ai_generated: questionData.is_ai_generated || false
      });
      return await question.save();
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  async createMany(questionsArray) {
    try {
      return await Question.insertMany(questionsArray);
    } catch (error) {
      console.error('Error in createMany:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      return await Question.findById(id);
    } catch (error) {
      console.error('Error getting question by ID:', error);
      throw error;
    }
  },

  async getByProductId(productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.error('Invalid ObjectId format for product ID:', productId);
        return [];
      }
      return await Question.find({ product: productId }).sort({ created_at: -1 });
    } catch (error) {
      console.error('Error getting questions by product ID:', error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      return await Question.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  async updateAnswer(id, answer) {
    try {
      return await Question.findByIdAndUpdate(
        id,
        { answer },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating question answer:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await Question.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  async deleteByProductId(productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.error('Invalid ObjectId format for product ID:', productId);
        return false;
      }
      const result = await Question.deleteMany({ product: productId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting questions by product ID:', error);
      throw error;
    }
  }
};
