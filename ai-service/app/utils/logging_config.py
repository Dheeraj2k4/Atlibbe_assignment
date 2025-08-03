import os
import logging
import sys
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def configure_logging(log_level: Optional[str] = None) -> None:
    """Configure logging for the application
    
    Args:
        log_level: Optional log level to override environment variable
    """
    # Get log level from environment or use provided level
    level = log_level or os.getenv("LOG_LEVEL", "INFO").upper()
    numeric_level = getattr(logging, level, logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(os.getenv("LOG_FILE", "ai_service.log"))
        ]
    )
    
    # Set log levels for specific loggers
    if os.getenv("DEBUG", "false").lower() == "true":
        # Enable debug logging for app modules
        logging.getLogger("app").setLevel(logging.DEBUG)
    else:
        # Set conservative log levels for external libraries
        logging.getLogger("uvicorn").setLevel(logging.WARNING)
        logging.getLogger("fastapi").setLevel(logging.WARNING)
    
    # Log configuration complete
    logging.getLogger(__name__).info(f"Logging configured with level: {level}")