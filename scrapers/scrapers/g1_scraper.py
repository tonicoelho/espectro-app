"""
G1 (Globo) Scraper
One of Brazil's largest news portals
Part of Grupo Globo - Pro-establishment
"""

import logging
from datetime import datetime
from typing import List, Optional
from urllib.parse import urljoin

from scrapers.base_scraper import BaseScraper, Article

logger = logging.getLogger(__name__)


class G1Scraper(BaseScraper):
    """
    Scraper for G1.globo.com
    Bias profile: Centrist economically, Pro-STF (Z-Axis: +5)
    """

    def __init__(self):
        super().__init__(
            source_name="G1",
            base_url="https://g1.globo.com"
        )

    def scrape_homepage(self) -> List[Article]:
        """
        Scrape top stories from G1 homepage
        """
        articles = []

        # Fetch homepage
        soup = self.fetch_page(self.base_url)
        if not soup:
            return articles

        # G1 uses <div class="feed-post-body"> for articles
        article_elements = soup.find_all("div", class_="feed-post-body", limit=20)

        logger.info(f"Found {len(article_elements)} article candidates on G1 homepage")

        for element in article_elements:
            try:
                # Extract title and URL
                title_tag = element.find("a", class_="feed-post-link")
                if not title_tag:
                    continue

                title = title_tag.get_text(strip=True)
                relative_url = title_tag.get("href", "")
                url = urljoin(self.base_url, relative_url)

                # Extract snippet (G1 uses <div class="feed-post-body-resumo">)
                snippet_tag = element.find("div", class_="feed-post-body-resumo")
                snippet = ""
                if snippet_tag:
                    snippet = snippet_tag.get_text(strip=True)
                else:
                    # Fallback: use first sentence of title
                    snippet = self.extract_snippet(title)

                # Extract image URL (optional in Data-Lite mode)
                image_url = None
                if not DATA_LITE_MODE:
                    img_tag = element.find_previous("img", class_="bstn-fd-picture-image")
                    if img_tag:
                        image_url = img_tag.get("src")

                # Create article object
                article = Article(
                    title=title,
                    url=url,
                    snippet=snippet,
                    source_name=self.source_name,
                    image_url=image_url,
                    published_at=datetime.now()  # G1 doesn't show publish dates on homepage
                )

                articles.append(article)
                logger.debug(f"✓ Scraped: {title[:60]}...")

            except Exception as e:
                logger.error(f"Error parsing G1 article element: {e}")
                continue

        return articles

    def scrape_article_details(self, article_url: str) -> Optional[Article]:
        """
        Scrape full article content from G1
        (This is for future use when we need full text for AI analysis)
        """
        soup = self.fetch_page(article_url)
        if not soup:
            return None

        try:
            # Title
            title_tag = soup.find("h1", class_="content-head__title")
            title = title_tag.get_text(strip=True) if title_tag else ""

            # Subtitle/Snippet
            subtitle_tag = soup.find("h2", class_="content-head__subtitle")
            snippet = ""
            if subtitle_tag:
                snippet = subtitle_tag.get_text(strip=True)

            # Full text (all paragraphs in article body)
            article_body = soup.find("div", class_="mc-article-body")
            full_text = ""
            if article_body:
                paragraphs = article_body.find_all("p")
                full_text = "\n\n".join([p.get_text(strip=True) for p in paragraphs])

            # Author
            author_tag = soup.find("p", class_="content-publication-data__from")
            author = author_tag.get_text(strip=True) if author_tag else None

            # Published date
            time_tag = soup.find("time")
            published_at = datetime.now()
            if time_tag and time_tag.get("datetime"):
                try:
                    published_at = datetime.fromisoformat(time_tag["datetime"].replace("Z", "+00:00"))
                except:
                    pass

            # Image
            image_url = None
            if not DATA_LITE_MODE:
                img_tag = soup.find("div", class_="progressive-img-container")
                if img_tag:
                    img = img_tag.find("img")
                    if img:
                        image_url = img.get("src")

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
            logger.error(f"Error scraping G1 article details from {article_url}: {e}")
            return None


# Import DATA_LITE_MODE at the end to avoid circular import
from config import DATA_LITE_MODE
