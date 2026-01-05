"""
Robots.txt Checker - Ensures Respectful Scraping
Espectro respects robots.txt and implements crawl delays
"""

import time
from urllib.parse import urlparse, urljoin
from urllib.robotparser import RobotFileParser
import requests
from typing import Dict, Optional
import logging

from config import USER_AGENT, ROBOTS_CACHE, CRAWL_DELAY

logger = logging.getLogger(__name__)


class RobotsChecker:
    """
    Checks robots.txt compliance and enforces crawl delays
    Critical for ethical scraping and avoiding IP bans
    """

    def __init__(self):
        self.cache: Dict[str, RobotFileParser] = ROBOTS_CACHE
        self.last_request_time: Dict[str, float] = {}

    def get_robots_parser(self, url: str) -> Optional[RobotFileParser]:
        """
        Fetch and parse robots.txt for a given domain
        """
        parsed = urlparse(url)
        domain = f"{parsed.scheme}://{parsed.netloc}"

        # Check cache first
        if domain in self.cache:
            return self.cache[domain]

        # Fetch robots.txt
        robots_url = urljoin(domain, "/robots.txt")

        try:
            logger.info(f"Fetching robots.txt from {robots_url}")
            response = requests.get(
                robots_url,
                headers={"User-Agent": USER_AGENT},
                timeout=5
            )

            if response.status_code == 200:
                parser = RobotFileParser()
                parser.parse(response.text.splitlines())
                self.cache[domain] = parser
                logger.info(f"✓ Successfully parsed robots.txt for {domain}")
                return parser
            else:
                logger.warning(f"No robots.txt found at {robots_url} (Status: {response.status_code})")
                # If no robots.txt, assume everything is allowed
                parser = RobotFileParser()
                parser.parse([])
                self.cache[domain] = parser
                return parser

        except Exception as e:
            logger.error(f"Error fetching robots.txt from {robots_url}: {e}")
            return None

    def can_fetch(self, url: str) -> bool:
        """
        Check if URL can be scraped according to robots.txt
        """
        parser = self.get_robots_parser(url)

        if parser is None:
            # If we can't fetch robots.txt, err on the side of caution
            logger.warning(f"Could not verify robots.txt for {url}, proceeding cautiously")
            return True

        allowed = parser.can_fetch(USER_AGENT, url)

        if not allowed:
            logger.warning(f"⚠ URL blocked by robots.txt: {url}")

        return allowed

    def get_crawl_delay(self, url: str) -> float:
        """
        Get the crawl delay specified in robots.txt
        Falls back to default CRAWL_DELAY from config
        """
        parser = self.get_robots_parser(url)

        if parser is None:
            return CRAWL_DELAY

        # Check for crawl-delay directive
        delay = parser.crawl_delay(USER_AGENT)

        if delay:
            logger.info(f"Crawl delay from robots.txt: {delay}s")
            return float(delay)

        return CRAWL_DELAY

    def enforce_rate_limit(self, url: str):
        """
        Enforce crawl delay between requests to the same domain
        """
        parsed = urlparse(url)
        domain = f"{parsed.scheme}://{parsed.netloc}"

        crawl_delay = self.get_crawl_delay(url)

        if domain in self.last_request_time:
            elapsed = time.time() - self.last_request_time[domain]

            if elapsed < crawl_delay:
                sleep_time = crawl_delay - elapsed
                logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f}s")
                time.sleep(sleep_time)

        self.last_request_time[domain] = time.time()


# Global instance
robots_checker = RobotsChecker()


def check_url_allowed(url: str) -> bool:
    """
    Convenience function to check if URL can be scraped
    """
    return robots_checker.can_fetch(url)


def wait_for_rate_limit(url: str):
    """
    Convenience function to enforce rate limiting
    """
    robots_checker.enforce_rate_limit(url)
