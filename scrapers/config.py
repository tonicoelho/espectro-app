"""
Espectro Scrapers Configuration
Centralized config for all Brazilian news scrapers
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base paths
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
LOGS_DIR = BASE_DIR / "logs"

# Ensure directories exist
OUTPUT_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Scraper settings
USER_AGENT = "EspectroBot/1.0 (+https://espectro.app; contact@espectro.app)"
REQUEST_TIMEOUT = 10  # seconds
MAX_RETRIES = 3
CRAWL_DELAY = 2  # seconds between requests (respectful scraping)

# Data-Lite Mode
# When enabled, ignores high-res images and focuses on text + metadata
DATA_LITE_MODE = os.getenv("DATA_LITE_MODE", "true").lower() == "true"

# Database connection (for direct ingestion)
DATABASE_URL = os.getenv("DATABASE_URL", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Backend API endpoint (alternative to direct DB)
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/v1")

# News sources configuration
SOURCES = {
    "g1": {
        "name": "G1",
        "url": "https://g1.globo.com",
        "rss": "https://g1.globo.com/rss/g1/",
        "source_id": None,  # Will be populated from database
        "bias_scores": {
            "economic": 0,  # Centrist on economy
            "social": 2,    # Slightly progressive
            "institutional": 5  # Strong pro-establishment (Grupo Globo)
        }
    },
    "folha": {
        "name": "Folha de S.Paulo",
        "url": "https://www.folha.uol.com.br",
        "rss": "https://feeds.folha.uol.com.br/poder/rss091.xml",
        "source_id": None,
        "bias_scores": {
            "economic": 1,
            "social": 2,
            "institutional": 4
        }
    },
    "estadao": {
        "name": "O Estado de S. Paulo",
        "url": "https://www.estadao.com.br",
        "rss": "https://www.estadao.com.br/rss/politica.xml",
        "source_id": None,
        "bias_scores": {
            "economic": 2,  # More market-oriented
            "social": 1,
            "institutional": 5
        }
    }
}

# Robots.txt cache
ROBOTS_CACHE = {}

# Logging configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s%(reset)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
