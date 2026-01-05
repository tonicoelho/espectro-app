#!/usr/bin/env ts-node
/**
 * Process Scraped Articles
 * CLI script to ingest JSON files from scrapers/output/
 *
 * Usage:
 *   ts-node src/scripts/process-scraped-articles.ts <json-file>
 *   ts-node src/scripts/process-scraped-articles.ts --all  # Process all files in output/
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArticleIngestionService } from '../services/articleIngestion';

const SCRAPERS_OUTPUT_DIR = path.join(__dirname, '../../../scrapers/output');

async function processFile(filepath: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing file: ${path.basename(filepath)}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const jsonData = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

    const ingestionService = new ArticleIngestionService();
    await ingestionService.processScraperOutput(jsonData);

  } catch (error) {
    console.error(`Error processing file ${filepath}:`, error);
  }
}

async function processAllFiles(): Promise<void> {
  if (!fs.existsSync(SCRAPERS_OUTPUT_DIR)) {
    console.error(`Output directory not found: ${SCRAPERS_OUTPUT_DIR}`);
    console.error('Run scrapers first: cd scrapers && python run_scrapers.py');
    process.exit(1);
  }

  const files = fs.readdirSync(SCRAPERS_OUTPUT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(SCRAPERS_OUTPUT_DIR, f));

  if (files.length === 0) {
    console.log('No JSON files found in scrapers/output/');
    console.log('Run scrapers first: cd scrapers && python run_scrapers.py');
    return;
  }

  console.log(`Found ${files.length} scraper output files\n`);

  for (const file of files) {
    await processFile(file);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('ALL FILES PROCESSED');
  console.log(`${'='.repeat(60)}\n`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage:');
    console.error('  ts-node src/scripts/process-scraped-articles.ts <json-file>');
    console.error('  ts-node src/scripts/process-scraped-articles.ts --all');
    process.exit(1);
  }

  if (args[0] === '--all') {
    await processAllFiles();
  } else {
    const filepath = path.resolve(args[0]);

    if (!fs.existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      process.exit(1);
    }

    await processFile(filepath);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
