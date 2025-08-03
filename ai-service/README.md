# Product Transparency AI Service

This microservice provides AI-powered functionality for the Product Transparency Platform, including:

1. Generating product-specific transparency questions
2. Calculating transparency scores based on product information and answers

## Architecture

The service is built with FastAPI and follows a modular architecture:

- `main.py`: Application entry point
- `app/api/`: API routes and request/response models
- `app/models/`: AI model implementations
- `app/utils/`: Utility functions for logging, error handling, etc.
- `app/tests/`: Unit and integration tests

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Configure environment variables by creating a `.env` file (see `.env.example` for reference)

## Running the Service

### Development Mode

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Question Generation

```
POST /api/generate-questions
```

Generates product-specific transparency questions based on product information.

**Request Body:**

```json
{
  "product": {
    "name": "Organic Honey",
    "description": "Pure organic honey from sustainable apiaries",
    "category": "food",
    "ingredients": "100% organic honey",
    "manufacturing_process": "Cold extraction, minimal processing",
    "country_of_origin": "New Zealand",
    "certifications": ["Organic", "Fair Trade"]
  },
  "num_questions": 5
}
```

**Response:**

```json
{
  "questions": [
    "What measures do you take to ensure honey safety?",
    "How do you verify the quality of ingredients in your honey?",
    "Are there any allergens processed in the same facility as your honey?",
    "What is the source of honey in your product?",
    "How do you ensure fair trade practices for ingredients in your honey?"
  ]
}
```

### Transparency Score Calculation

```
POST /api/calculate-transparency-score
```

Calculates a transparency score based on product information and answers to transparency questions.

**Request Body:**

```json
{
  "product": {
    "name": "Organic Honey",
    "description": "Pure organic honey from sustainable apiaries",
    "category": "food",
    "ingredients": "100% organic honey",
    "manufacturing_process": "Cold extraction, minimal processing",
    "country_of_origin": "New Zealand",
    "certifications": ["Organic", "Fair Trade"]
  },
  "answers": {
    "What measures do you take to ensure honey safety?": "Our honey undergoes rigorous testing for contaminants and is certified organic.",
    "How do you verify the quality of ingredients?": "We work directly with beekeepers and test each batch for purity and quality.",
    "What sustainability practices are implemented?": "Our apiaries follow sustainable beekeeping practices and we use recyclable packaging.",
    "How do you ensure ethical sourcing?": "We pay fair prices to beekeepers and have Fair Trade certification.",
    "Are there any allergens processed in the same facility?": "No, our facility processes only honey products."
  }
}
```

**Response:**

```json
{
  "score": 8.5,
  "feedback": "Excellent transparency! Your product provides comprehensive information that helps consumers make informed decisions. Increasing transparency can build consumer trust and differentiate your product in the marketplace.",
  "areas_for_improvement": [
    "Provide more detailed information about the manufacturing process",
    "Share more details about testing methods and results"
  ]
}
```

## Testing

Run tests using pytest:

```bash
python -m pytest
```

Or with coverage:

```bash
python -m pytest --cov=app
```

## Future Improvements

- Implement more sophisticated NLP models for question generation
- Add support for more product categories
- Improve transparency scoring algorithm with machine learning
- Add support for multi-language processing