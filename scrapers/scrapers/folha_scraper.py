"""
Folha de S.Paulo Scraper
One of Brazil's most influential newspapers
Center-left, Pro-establishment
"""

import logging
from datetime import datetime
from typing import List, Optional
from urllib.parse import urljoin
import re

from scrapers.base_scraper import BaseScraper, Article

logger = logging.getLogger(__name__)


class FolhaScraper(BaseScraper):
    """
    Scraper for Folha.uol.com.br
    Bias profile: Center-left, Pro-STF (Z-Axis: +4)
    """

    def __init__(self):
        super().__init__(
            source_name="Folha de S.Paulo",
            base_url="https://www.folha.uol.com.br"
        )

    def scrape_homepage(self) -> List[Article]:
        """
        Scrape top stories from Folha homepage
        """
        articles = []

        # Fetch homepage
        soup = self.fetch_page(self.base_url)
        if not soup:
            return articles

        # Folha uses <div class="c-headline"> for main stories
        article_elements = soup.find_all("div", class_="c-headline", limit=20)

        logger.info(f"Found {len(article_elements)} article candidates on Folha homepage")

        for element in article_elements:
            try:
                # Extract title and URL
                title_tag = element.find("a", class_="c-headline__url")
                if not title_tag:
                    # Alternative selector
                    title_tag = element.find("a")

                if not title_tag:
                    continue

                title_text_tag = title_tag.find("h2") or title_tag.find("h3")
                if not title_text_tag:
                    title = title_tag.get_text(strip=True)
                else:
                    title = title_text_tag.get_text(strip=True)

                url = title_tag.get("href", "")
                if not url.startswith("http"):
                    url = urljoin(self.base_url, url)

                # Extract snippet
                snippet_tag = element.find("p", class_="c-headline__standfirst")
                snippet = ""
                if snippet_tag:
                    snippet = snippet_tag.get_text(strip=True)
                else:
                    snippet = self.extract_snippet(title)

                # Extract image URL (optional in Data-Lite mode)
                image_url = None
                if not DATA_LITE_MODE:
                    img_tag = element.find("img")
                    if img_tag:
                        image_url = img_tag.get("data-src") or img_tag.get("src")

                # Create article object
                article = Article(
                    title=title,
                    url=url,
                    snippet=snippet,
                    source_name=self.source_name,
                    image_url=image_url,
                    published_at=datetime.now()
                )

                articles.append(article)
                logger.debug(f"✓ Scraped: {title[:60]}...")

            except Exception as e:
                logger.error(f"Error parsing Folha article element: {e}")
                continue

        return articles

    def scrape_article_details(self, article_url: str) -> Optional[Article]:
        """
        Scrape full article content from Folha
        Note: Folha has a paywall, so full text may not always be available
        """
        soup = self.fetch_page(article_url)
        if not soup:
            return None

        try:
            # Title
            title_tag = soup.find("h1", class_="c-content-head__title")
            title = title_tag.get_text(strip=True) if title_tag else ""

            # Subtitle/Snippet
            subtitle_tag = soup.find("h2", class_="c-content-head__subtitle")
            snippet = ""
            if subtitle_tag:
                snippet = subtitle_tag.get_text(strip=True)

            # Full text (Folha uses <div class="c-news__body">)
            article_body = soup.find("div", class_="c-news__body")
            full_text = ""

            if article_body:
                paragraphs = article_body.find_all("p", class_="c-news__paragraph")
                if not paragraphs:
                    paragraphs = article_body.find_all("p")

                full_text = "\n\n".join([p.get_text(strip=True) for p in paragraphs])

            # Check for paywall
            if "Cadastre-se gratuitamente" in full_text or "Assine a Folha" in full_text:
                logger.warning(f"Paywall detected on {article_url}")
                # Use snippet as fallback
                full_text = snippet

            # Author
            author_tag = soup.find("p", class_="c-signature__author")
            author = None
            if author_tag:
                author = author_tag.get_text(strip=True)

            # Published date
            time_tag = soup.find("time", class_="c-signature__time")
            published_at = datetime.now()
            if time_tag and time_tag.get("datetime"):
                try:
                    published_at = datetime.fromisoformat(time_tag["datetime"].replace("Z", "+00:00"))
                except:
                    pass

            # Image
            image_url = None
            if not DATA_LITE_MODE:
                img_tag = soup.find("div", class_="c-news__image")
                if img_tag:
                    img = img_tag.find("img")
                    if img:
                        image_url = img.get("data-src") or img.get("src")

            return Article(
                title=title,
                url=article_url,
                snippet=snippet or self.extract_snippet(full_text),
                source_name=self.source_name,
                published_at=published_at,
                image_url=image_url,
                author=author,
                full_text=full_text
            )

        except Exception as e:
            logger.error(f"Error scraping Folha article details from {article_url}: {e}")
            return None


# Import DATA_LITE_MODE at the end to avoid circular import
from config import DATA_LITE_MODE
