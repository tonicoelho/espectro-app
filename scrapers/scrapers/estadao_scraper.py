"""
Estadão (O Estado de S. Paulo) Scraper
Traditional Brazilian newspaper
Center-right, Pro-establishment
"""

import logging
from datetime import datetime
from typing import List, Optional
from urllib.parse import urljoin
import re

from scrapers.base_scraper import BaseScraper, Article

logger = logging.getLogger(__name__)


class EstadaoScraper(BaseScraper):
    """
    Scraper for Estadao.com.br
    Bias profile: Center-right, Pro-STF (Z-Axis: +5)
    """

    def __init__(self):
        super().__init__(
            source_name="O Estado de S. Paulo",
            base_url="https://www.estadao.com.br"
        )

    def scrape_homepage(self) -> List[Article]:
        """
        Scrape top stories from Estadão homepage
        """
        articles = []

        # Fetch homepage
        soup = self.fetch_page(self.base_url)
        if not soup:
            return articles

        # Estadão uses various article containers
        # Try multiple selectors for robustness
        article_elements = []

        # Primary selector
        article_elements.extend(soup.find_all("div", class_="noticia", limit=15))

        # Alternative selectors
        if len(article_elements) < 10:
            article_elements.extend(soup.find_all("article", limit=15))

        logger.info(f"Found {len(article_elements)} article candidates on Estadão homepage")

        seen_urls = set()

        for element in article_elements:
            try:
                # Extract title and URL
                title_tag = element.find("a")
                if not title_tag:
                    continue

                # Get title (could be in h2, h3, or directly in <a>)
                title_element = (
                    title_tag.find("h2") or
                    title_tag.find("h3") or
                    title_tag.find("span", class_="titulo") or
                    title_tag
                )

                title = title_element.get_text(strip=True)
                if not title or len(title) < 20:  # Filter out navigation links
                    continue

                url = title_tag.get("href", "")
                if not url.startswith("http"):
                    url = urljoin(self.base_url, url)

                # Skip duplicates
                if url in seen_urls:
                    continue
                seen_urls.add(url)

                # Extract snippet
                snippet_tag = element.find("p", class_="intro") or element.find("p")
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
                logger.error(f"Error parsing Estadão article element: {e}")
                continue

        return articles

    def scrape_article_details(self, article_url: str) -> Optional[Article]:
        """
        Scrape full article content from Estadão
        Note: Estadão has a paywall for some content
        """
        soup = self.fetch_page(article_url)
        if not soup:
            return None

        try:
            # Title
            title_tag = soup.find("h1") or soup.find("h1", class_="title")
            title = title_tag.get_text(strip=True) if title_tag else ""

            # Subtitle/Snippet
            subtitle_tag = soup.find("h2", class_="subtitle") or soup.find("p", class_="intro")
            snippet = ""
            if subtitle_tag:
                snippet = subtitle_tag.get_text(strip=True)

            # Full text
            article_body = soup.find("article") or soup.find("div", class_="content")
            full_text = ""

            if article_body:
                paragraphs = article_body.find_all("p")
                # Filter out non-content paragraphs
                text_paragraphs = [
                    p.get_text(strip=True)
                    for p in paragraphs
                    if len(p.get_text(strip=True)) > 50
                ]
                full_text = "\n\n".join(text_paragraphs)

            # Check for paywall
            if "Assine o Estadão" in full_text or "Cadastro gratuito" in full_text:
                logger.warning(f"Paywall detected on {article_url}")
                full_text = snippet

            # Author
            author_tag = soup.find("span", class_="autor") or soup.find("a", class_="autor")
            author = None
            if author_tag:
                author = author_tag.get_text(strip=True)

            # Published date
            time_tag = soup.find("time") or soup.find("span", class_="data")
            published_at = datetime.now()
            if time_tag:
                datetime_str = time_tag.get("datetime") or time_tag.get_text(strip=True)
                try:
                    # Try ISO format first
                    published_at = datetime.fromisoformat(datetime_str.replace("Z", "+00:00"))
                except:
                    # Fallback for Brazilian date format (e.g., "05/01/2026")
                    try:
                        published_at = datetime.strptime(datetime_str, "%d/%m/%Y")
                    except:
                        pass

            # Image
            image_url = None
            if not DATA_LITE_MODE:
                img_tag = soup.find("figure") or soup.find("div", class_="foto")
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
            logger.error(f"Error scraping Estadão article details from {article_url}: {e}")
            return None


# Import DATA_LITE_MODE at the end to avoid circular import
from config import DATA_LITE_MODE
