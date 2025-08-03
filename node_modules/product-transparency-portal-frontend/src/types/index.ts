// Product Types
export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  ingredients: string[] | string; // Can be either array (for frontend) or string (for AI service)
  manufacturing_location: string;
  manufacturing_process?: string; // For AI service
  country_of_origin?: string; // Country where the product is manufactured
  certifications: string[];
  additional_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Question Types
export interface Question {
  id?: string;
  product_id?: string;
  question_text: string;
  answer?: string;
  question_type: 'text' | 'select' | 'multiselect' | 'boolean';
  options?: string[] | { value: string; label: string }[];
  required: boolean;
  order?: number;
  conditional_logic?: ConditionalLogic;
  tooltip?: string;
}

export interface ConditionalLogic {
  dependent_on_question_id?: string;
  show_if_answer_equals?: string | string[];
}

// Form Types
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Question[];
}

export interface FormValues {
  [key: string]: any;
}

// Report Types
export interface Report {
  id?: string;
  product_id: string;
  pdf_url?: string;
  transparency_score?: number;
  feedback?: string;
  strengths?: string[];
  areas_for_improvement?: string[];
  created_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// AI Service Types
export interface GenerateQuestionsRequest {
  product: Product;
  existing_answers?: Record<string, any>;
  num_questions?: number;
}

export interface GenerateQuestionsResponse {
  questions: string[];
}

export interface TransparencyScoreRequest {
  product: Product;
  answers: Record<string, any>;
}

export interface TransparencyScoreResponse {
  score: number;
  feedback: string;
  areas_to_improve: string[];
  strengths: string[];
}
export interface Report {
  // other fields...
  product: string; // assuming it's an ObjectId or product ID
}