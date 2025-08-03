from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Dict, Any, List, Union
import logging

# Configure logger
logger = logging.getLogger(__name__)

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle validation errors and return a standardized response
    
    Args:
        request: The request that caused the exception
        exc: The validation exception
        
    Returns:
        JSONResponse with error details
    """
    # Extract error details
    errors = []
    for error in exc.errors():
        error_location = " -> ".join(str(loc) for loc in error["loc"])
        errors.append({
            "location": error_location,
            "message": error["msg"],
            "type": error["type"]
        })
    
    # Log the validation error
    logger.warning(f"Validation error: {errors}")
    
    # Return standardized error response
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Validation error",
            "errors": errors
        }
    )

async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle general exceptions and return a standardized response
    
    Args:
        request: The request that caused the exception
        exc: The exception
        
    Returns:
        JSONResponse with error details
    """
    # Log the exception
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    # Return standardized error response
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "Internal server error",
            "detail": str(exc)
        }
    )