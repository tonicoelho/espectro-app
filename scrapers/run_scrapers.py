#!/usr/bin/env python3
"""
Espectro Scrapers - Main Runner
Run all Brazilian news scrapers (G1, Folha, Estadão)

Usage:
    python run_scrapers.py              # Run all scrapers
    python run_scrapers.py --source g1  # Run specific scraper
    python run_scrapers.py --lite       # Force Data-Lite mode
"""

import argparse
import logging
import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent))

from scrapers.g1_scraper import G1Scraper
from scrapers.folha_scraper import FolhaScraper
from scrapers.estadao_scraper import EstadaoScraper
from config import LOG_LEVEL, LOG_FORMAT, LOG_DATE_FORMAT, LOGS_DIR, DATA_LITE_MODE

import colorlog


def setup_logging():
    """
    Configure logging with colors
    """
    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(
        LOG_FORMAT,
        datefmt=LOG_DATE_FORMAT,
        log_colors={
            'DEBUG': 'cyan',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red,bg_white',
        }
    ))

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(LOG_LEVEL)
    root_logger.addHandler(handler)

    # File logger (for debugging)
    file_handler = logging.FileHandler(LOGS_DIR / "scrapers.log")
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    ))
    root_logger.addHandler(file_handler)


def run_all_scrapers():
    """
    Run all available scrapers
    """
    scrapers = [
        G1Scraper(),
        FolhaScraper(),
        EstadaoScraper()
    ]

    total_articles = 0

    for scraper in scrapers:
        try:
            logging.info(f"\n{'='*60}")
            logging.info(f"Running: {scraper.source_name}")
            logging.info(f"{'='*60}")

            articles = scraper.run()
            total_articles += len(articles)

            logging.info(f"✓ {scraper.source_name}: {len(articles)} articles scraped")

        except Exception as e:
            logging.error(f"✗ Failed to run {scraper.source_name}: {e}", exc_info=True)

    logging.info(f"\n{'='*60}")
    logging.info(f"SUMMARY: {total_articles} total articles scraped")
    logging.info(f"{'='*60}\n")

    return total_articles


def run_single_scraper(source_name: str):
    """
    Run a specific scraper
    """
    scrapers = {
        "g1": G1Scraper(),
        "folha": FolhaScraper(),
        "estadao": EstadaoScraper()
    }

    source_key = source_name.lower()

    if source_key not in scrapers:
        logging.error(f"Unknown source: {source_name}")
        logging.info(f"Available sources: {', '.join(scrapers.keys())}")
        return 0

    scraper = scrapers[source_key]

    logging.info(f"\n{'='*60}")
    logging.info(f"Running: {scraper.source_name}")
    logging.info(f"{'='*60}")

    articles = scraper.run()

    logging.info(f"\n{'='*60}")
    logging.info(f"SUMMARY: {len(articles)} articles scraped")
    logging.info(f"{'='*60}\n")

    return len(articles)


def main():
    """
    CLI entry point
    """
    parser = argparse.ArgumentParser(
        description="Espectro News Scrapers - Brazilian Media Bias Tracker"
    )

    parser.add_argument(
        "--source",
        type=str,
        help="Run specific scraper (g1, folha, estadao)"
    )

    parser.add_argument(
        "--lite",
        action="store_true",
        help="Force Data-Lite mode (ignore images)"
    )

    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable debug logging"
    )

    args = parser.parse_args()

    # Setup logging
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    setup_logging()

    # Override Data-Lite mode if specified
    if args.lite:
        import config
        config.DATA_LITE_MODE = True
        logging.info("Data-Lite Mode: FORCED ON")

    logging.info("🇧🇷 Espectro News Scrapers")
    logging.info(f"Data-Lite Mode: {'ON' if DATA_LITE_MODE else 'OFF'}")
    logging.info("")

    # Run scrapers
    if args.source:
        run_single_scraper(args.source)
    else:
        run_all_scrapers()


if __name__ == "__main__":
    main()
