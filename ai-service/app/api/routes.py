from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from app.models.question_generator import QuestionGenerator

# Import models
from app.models.transparency_scorer import TransparencyScorer

# Configure logging
logger = logging.getLogger(__name__)

# Define API routers
question_router = APIRouter(tags=["Questions"])
transparency_router = APIRouter(tags=["Transparency"])

# Define request/response models
class ProductInfo(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    ingredients: Optional[str] = None
    manufacturing_process: Optional[str] = None
    country_of_origin: Optional[str] = None
    certifications: Optional[List[str]] = None

class GenerateQuestionsRequest(BaseModel):
    product: ProductInfo
    num_questions: Optional[int] = Field(default=5, ge=1, le=20)

class GenerateQuestionsResponse(BaseModel):
    questions: List[str]

class TransparencyScoreRequest(BaseModel):
    product: ProductInfo
    answers: Dict[str, str] = Field(..., description="Dictionary of question-answer pairs")

class TransparencyScoreResponse(BaseModel):
    score: float = Field(..., ge=0, le=10)
    feedback: str
    areas_for_improvement: List[str]

# Dependency to get question generator model
async def get_question_generator():
    return QuestionGenerator()

# Dependency to get transparency scorer model
async def get_transparency_scorer():
    return TransparencyScorer()

@question_router.post(
    "/generate-questions",
    response_model=GenerateQuestionsResponse,
    summary="Generate product-specific questions"
)
async def generate_questions(
    request: GenerateQuestionsRequest,
    question_generator: QuestionGenerator = Depends(get_question_generator)
):
    try:
        logger.info(f"Generating questions for product: {request.product.name}")
        
        # Generate questions based on product information
        questions = question_generator.generate(
            product_info=request.product.dict(),
            num_questions=request.num_questions
        )
        
        return GenerateQuestionsResponse(questions=questions)
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

@transparency_router.post(
    "/calculate-transparency-score",
    response_model=TransparencyScoreResponse,
    summary="Calculate product transparency score"
)
async def calculate_transparency_score(
    request: TransparencyScoreRequest,
    transparency_scorer: TransparencyScorer = Depends(get_transparency_scorer)
):
    try:
        logger.info(f"Calculating transparency score for product: {request.product.name}")
        
        # Calculate transparency score based on product information and answers
        result = transparency_scorer.calculate_score(
            product_info=request.product.dict(),
            answers=request.answers
        )
        
        return TransparencyScoreResponse(
            score=result["score"],
            feedback=result["feedback"],
            areas_for_improvement=result["areas_for_improvement"]
        )
    except Exception as e:
        logger.error(f"Error calculating transparency score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate transparency score: {str(e)}")