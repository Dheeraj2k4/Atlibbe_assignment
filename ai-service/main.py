import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

load_dotenv()

# Import API routers
from app.api.routes import question_router, transparency_router

# Import utilities
from app.utils.logging_config import configure_logging
from app.utils.error_handlers import validation_exception_handler, general_exception_handler

# Configure logging
configure_logging()

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Product Transparency AI Service",
    description="AI microservice for generating product transparency questions and scoring",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(question_router, prefix="/api")
app.include_router(transparency_router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI service is running"}

# Register error handlers
@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return await validation_exception_handler(request, exc)

@app.exception_handler(HTTPException)
async def http_error_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP error: {exc.detail}")
    return {"status": "error", "message": exc.detail}

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return await general_exception_handler(request, exc)

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    logger.info(f"Starting AI service on {host}:{port}")
    
    uvicorn.run("main:app", host=host, port=port, reload=debug)