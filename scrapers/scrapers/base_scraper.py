"""
Base Scraper Class
All Brazilian news scrapers inherit from this
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from abc import ABC, abstractmethod

import requests
from bs4 import BeautifulSoup

from config import (
    USER_AGENT, REQUEST_TIMEOUT, MAX_RETRIES,
    OUTPUT_DIR, DATA_LITE_MODE
)
from utils.robots_checker import check_url_allowed, wait_for_rate_limit

logger = logging.getLogger(__name__)


class Article:
    """
    Structured article data
    """
    def __init__(
        self,
        title: str,
        url: str,
        snippet: str,
        source_name: str,
        published_at: Optional[datetime] = None,
        image_url: Optional[str] = None,
        author: Optional[str] = None,
        full_text: Optional[str] = None
    ):
        self.title = title
        self.url = url
        self.snippet = snippet
        self.source_name = source_name
        self.published_at = published_at or datetime.now()
        self.image_url = image_url if not DATA_LITE_MODE else None
        self.author = author
        self.full_text = full_text

    def to_dict(self) -> Dict:
        """
        Convert to JSON-serializable dict
        """
        return {
            "title": self.title,
            "url": self.url,
            "snippet": self.snippet,
            "source_name": self.source_name,
            "published_at": self.published_at.isoformat(),
            "image_url": self.image_url,
            "author": self.author,
            "full_text": self.full_text
        }


class BaseScraper(ABC):
    """
    Base class for all news scrapers
    Handles robots.txt, rate limiting, and data persistence
    """

    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})
        self.articles: List[Article] = []

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """
        Fetch and parse a web page with robots.txt compliance
        """
        # Check robots.txt
        if not check_url_allowed(url):
            logger.warning(f"Skipping {url} - blocked by robots.txt")
            return None

        # Enforce rate limiting
        wait_for_rate_limit(url)

        # Fetch with retries
        for attempt in range(MAX_RETRIES):
            try:
                logger.debug(f"Fetching {url} (attempt {attempt + 1}/{MAX_RETRIES})")

                response = self.session.get(url, timeout=REQUEST_TIMEOUT)
                response.raise_for_status()

                # Parse HTML
                soup = BeautifulSoup(response.content, "lxml")
                return soup

            except requests.exceptions.RequestException as e:
                logger.error(f"Error fetching {url}: {e}")

                if attempt == MAX_RETRIES - 1:
                    logger.error(f"Failed to fetch {url} after {MAX_RETRIES} attempts")
                    return None

        return None

    @abstractmethod
    def scrape_homepage(self) -> List[Article]:
        """
        Scrape articles from the homepage
        Must be implemented by each source-specific scraper
        """
        pass

    @abstractmethod
    def scrape_article_details(self, article_url: str) -> Optional[Article]:
        """
        Scrape full article content
        Must be implemented by each source-specific scraper
        """
        pass

    def extract_snippet(self, text: str, max_length: int = 280) -> str:
        """
        Extract a snippet (2-sentence summary) from text
        Max 280 chars (Twitter-like)
        """
        sentences = text.split(".")[:2]
        snippet = ". ".join(sentences).strip()

        if len(snippet) > max_length:
            snippet = snippet[:max_length].rsplit(" ", 1)[0] + "..."

        return snippet

    def save_to_json(self) -> Path:
        """
        Save scraped articles to JSON file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.source_name.lower().replace(' ', '_')}_{timestamp}.json"
        filepath = OUTPUT_DIR / filename

        data = {
            "source": self.source_name,
            "scraped_at": datetime.now().isoformat(),
            "article_count": len(self.articles),
            "data_lite_mode": DATA_LITE_MODE,
            "articles": [article.to_dict() for article in self.articles]
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(f"✓ Saved {len(self.articles)} articles to {filepath}")
        return filepath

    def run(self) -> List[Article]:
        """
        Main execution method
        """
        logger.info(f"Starting scraper for {self.source_name}")
        logger.info(f"Data-Lite Mode: {'ON' if DATA_LITE_MODE else 'OFF'}")

        try:
            # Scrape homepage
            self.articles = self.scrape_homepage()

            logger.info(f"✓ Scraped {len(self.articles)} articles from {self.source_name}")

            # Save to JSON
            if self.articles:
                self.save_to_json()

            return self.articles

        except Exception as e:
            logger.error(f"Error in scraper for {self.source_name}: {e}", exc_info=True)
            return []
