-- Drop tables if they exist (for clean initialization)
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  ingredients TEXT,
  manufacturing_process TEXT,
  certifications TEXT[],
  country_of_origin VARCHAR(100),
  transparency_score DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer TEXT,
  question_type VARCHAR(50) DEFAULT 'text',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  pdf_url VARCHAR(255),
  feedback TEXT,
  areas_for_improvement TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_questions_product_id ON questions(product_id);
CREATE INDEX idx_reports_product_id ON reports(product_id);

-- Add some sample data for testing
INSERT INTO users (company_name, email, password) VALUES 
('Sample Company', 'test@example.com', '$2a$10$rIC/VrfX21MvkX3QLYxIqOBcboxP4KiMxwwK/P1p0OrHuFSUXgwQi'); -- password is 'password123'

INSERT INTO products (user_id, name, description, category, ingredients, manufacturing_process, certifications, country_of_origin) VALUES 
(1, 'Organic Honey', 'Pure organic honey from wildflower meadows', 'Food', 'Raw honey', 'Cold extraction, no heating', ARRAY['Organic', 'Non-GMO'], 'New Zealand');

INSERT INTO questions (product_id, question_text, answer, question_type, is_ai_generated) VALUES 
(1, 'Are there any additives in this product?', 'No, our honey is 100% pure with no additives or preservatives.', 'text', false),
(1, 'What measures are taken to ensure bee welfare?', 'We follow sustainable beekeeping practices, ensuring hives are not overharvested and bees have access to diverse, pesticide-free foraging areas.', 'text', true);

INSERT INTO reports (product_id, pdf_url, feedback, areas_for_improvement) VALUES 
(1, '/public/reports/product_1_report.pdf', 'Good transparency overall. Clear ingredient information provided.', ARRAY['Could provide more details about the specific wildflower sources', 'Consider adding third-party verification of sustainability claims']);