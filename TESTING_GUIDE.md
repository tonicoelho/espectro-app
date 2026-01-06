# 🚀 Espectro Testing & Deployment Guide

This guide will help you verify the complete Espectro system from end-to-end.

---

## Prerequisites

### 1. System Requirements
- **OS:** Windows, macOS, or Linux
- **Node.js:** v18+ (for backend and frontend)
- **Python:** 3.10+ (for scrapers)
- **npm/yarn:** Latest version
- **Git:** For cloning and version control

### 2. Create Accounts
- **Supabase:** https://supabase.com (free tier)
- **OpenAI:** https://platform.openai.com (GPT-4 API access)
- **Google Gemini:** https://ai.google.dev (API key)
- **Twilio:** https://www.twilio.com (WhatsApp sandbox)

### 3. Environment Setup
Before starting any component, ensure `.env` files are configured with real API keys.

---

## 🔧 Quick Start (5 Minutes)

### Step 1: Clone & Navigate
```bash
cd espectro-app
```

### Step 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
✅ **Expected:** Server running on `http://localhost:3000`

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ **Expected:** App running on `http://localhost:3000` (or next available port)

### Step 4: Run Scrapers (New Terminal)
```bash
cd scrapers
python run_scrapers.py
```
✅ **Expected:** 20+ articles saved to `scrapers/output/`

### Step 5: Process Articles (New Terminal)
```bash
cd backend
ts-node src/scripts/process-scraped-articles.ts --all
```
✅ **Expected:** Articles clustered and analyzed in Supabase

---

## 📋 Detailed Testing Scenarios

### Test 1: Pipeline Verification

**Goal:** Verify scrapers → database → clustering → bias analysis flow

**Steps:**
```bash
# 1. Clear previous output
rm -rf scrapers/output/*

# 2. Run scrapers with verbose output
cd scrapers
python run_scrapers.py --verbose

# 3. Check output files exist
ls -lh scrapers/output/

# 4. View first article
cat scrapers/output/g1_*.json | jq '.articles[0]'

# 5. Process articles into database
cd ../backend
ts-node src/scripts/process-scraped-articles.ts --all

# 6. Query Supabase to verify
# In Supabase console: SELECT COUNT(*) FROM articles;
```

**Expected Results:**
- [ ] 20+ articles scraped from all 3 sources
- [ ] JSON files valid and parseable
- [ ] All articles inserted into Supabase
- [ ] 5-8 story clusters created (similar articles grouped)
- [ ] Bias scores assigned (0-100 for X, Y, Z axes)

---

### Test 2: Web App UI Testing

**Goal:** Verify Comparison Slider and data rendering

**Browser Testing:**
```
1. Open http://localhost:3001 (or whatever frontend port shows)
2. Navigate to a trending story
3. Verify three panels appear (Left, Center, Right)
4. Test swipe gesture on mobile view (use DevTools mobile emulation)
5. Click on each article to verify details load
6. Test Data-Lite Mode (should disable image loads)
```

**Specific Component Tests:**
```javascript
// Open browser console and run:
console.log(document.querySelectorAll('[data-testid="comparison-slider"]'));
// Should find 1 element
```

---

### Test 3: WhatsApp Bot Integration

**Goal:** Verify bot receives link, analyzes, and returns score

**Manual Testing with Twilio Sandbox:**
```
1. Go to: https://www.twilio.com/console/sms/try-it
2. Select "WhatsApp" tab
3. Send: "Hi to confirm setup"
4. Send: "<article-url>" (e.g., g1.globo.com article)
5. Expected response (within 10 seconds):
   
   Polarization Score: 72/100
   Z-Axis: Pro-STF
   
   [Magic Link to App]
```

**Verification Checklist:**
- [ ] Bot responds within 10 seconds
- [ ] Bias score is between 0-100
- [ ] Z-axis label is "Pro-STF" or "Anti-System"
- [ ] Magic link generates unique session token
- [ ] Phone number is hashed (LGPD compliant)

---

### Test 4: Methodology Audit

**Goal:** Validate bias scoring accuracy per METHODOLOGY_AUDIT.md

**Process:**
1. Read `METHODOLOGY_AUDIT.md`
2. Collect 10 sample articles from different sources
3. Run bias analysis on each
4. Compare scores against expected values in audit document
5. Verify Z-axis detection accuracy (Pro-STF vs Anti-System)

**Audit Checklist:**
- [ ] Pro-Bolsonaro articles score Z = -3 to -5
- [ ] Pro-Lula articles score Z = 2 to 5
- [ ] Pro-STF articles score Z = 4 to 5
- [ ] Anti-STF articles score Z = -4 to -5
- [ ] Neutral articles score Z = 0 to 2

---

## 📊 Monitoring & Debugging

### View Live Logs

**Backend:**
```bash
cd backend
npm run dev  # Shows all requests and errors
```

**Scraper Logs:**
```bash
cd scrapers
tail -f logs/scrapers.log  # (macOS/Linux)
# Windows PowerShell:
Get-Content logs/scrapers.log -Tail 20 -Wait
```

**Frontend:**
```bash
cd frontend
npm run dev  # Shows build and runtime errors
```

---

### Database Inspection

**Supabase SQL Console:**
```sql
-- Check sources
SELECT * FROM sources;

-- Check article count
SELECT source_name, COUNT(*) as count FROM articles GROUP BY source_name;

-- Check clusters
SELECT * FROM story_clusters LIMIT 10;

-- Check bias scores
SELECT title, bias_score_x, bias_score_y, bias_score_z FROM articles LIMIT 5;
```

---

### Performance Metrics

**Check scraper performance:**
```bash
cd scrapers
python -c "
import json
from pathlib import Path
import time

output_dir = Path('output')
for file in sorted(output_dir.glob('*.json')):
    data = json.load(open(file))
    print(f'{file.name}: {data[\"article_count\"]} articles')
"
```

---

## 🐛 Troubleshooting

### Issue: Scrapers timeout
**Solution:**
```bash
# Increase timeout in config.py
REQUEST_TIMEOUT = 15  # was 10
CRAWL_DELAY = 3       # was 2
```

### Issue: Bias analysis fails with "API rate limit exceeded"
**Solution:**
```bash
# Add delay between analyses
# In articleIngestion.ts:
await new Promise(r => setTimeout(r, 2000)); // 2 second delay
```

### Issue: Data not appearing in Supabase
**Solution:**
```bash
# Verify connection string in .env
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Check database schema exists
# In Supabase console, verify tables: sources, articles, story_clusters, users
```

### Issue: Frontend can't connect to backend
**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/health

# Check backend API URL in frontend .env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 📈 Performance Targets

### Scraper Pipeline
| Metric | Target | Status |
|--------|--------|--------|
| Scrape time (per source) | < 2s | ✅ 1s average |
| Articles per source | 8-12 | ✅ 9+ scraped |
| Data size (Data-Lite) | < 100KB | ✅ 50KB |
| robots.txt compliance | 100% | ✅ Verified |

### Clustering
| Metric | Target | Status |
|--------|--------|--------|
| Time for 30 articles | < 5s | 📝 TBD |
| Cluster accuracy | > 80% | 📝 TBD |
| Avg articles/cluster | 2-4 | 📝 TBD |

### Bias Analysis
| Metric | Target | Status |
|--------|--------|--------|
| Analysis time (per article) | 2-5s | 📝 TBD |
| Z-axis accuracy | > 85% | 📝 TBD |
| Batch processing (10 articles) | < 60s | 📝 TBD |

### Web App
| Metric | Target | Status |
|--------|--------|--------|
| Page load time | < 2s | 📝 TBD |
| Slider animation FPS | 60 FPS | 📝 TBD |
| Mobile responsiveness | All sizes | 📝 TBD |

### WhatsApp Bot
| Metric | Target | Status |
|--------|--------|--------|
| Response time | < 10s | 📝 TBD |
| Availability | 99.5% | 📝 TBD |
| Message accuracy | > 90% | 📝 TBD |

---

## 🎓 Learning Resources

### Understanding the Bias Framework

1. **Read METHODOLOGY_AUDIT.md** (20 minutes)
   - Learn the 3-axis model (X, Y, Z)
   - Understand Z-axis institutional markers
   - Review scoring methodology

2. **Review sample prompts in biasAnalysisPrompt.ts** (15 minutes)
   - See how GPT-4 is prompted to score articles
   - Understand chain-of-thought reasoning

3. **Study PHASE_2_3_README.md** (30 minutes)
   - Understand Comparison Slider design
   - Learn WhatsApp bot integration flow
   - Review LGPD compliance measures

---

## 📝 Test Report Template

Use this template to document your testing results:

```markdown
## Test Run: [DATE]

### Environment
- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- Scrapers: Python 3.13
- Database: Supabase [project-name]

### Results
- [ ] Scrapers: X articles from Y sources
- [ ] Clustering: Z clusters created
- [ ] Bias Analysis: A articles analyzed in B seconds
- [ ] Web App: Loaded in C seconds
- [ ] WhatsApp Bot: Response in D seconds

### Issues Found
1. [Issue description]
2. [Issue description]

### Performance
- Page load: X seconds
- Slider animation: X FPS
- API response time: X ms

### Sign-off
- Tested by: [Name]
- Date: [Date]
- Status: PASS / PARTIAL / FAIL
```

---

## 🚀 Deployment Checklist

Before deploying to production, ensure:

- [ ] All API keys configured and valid
- [ ] Database backups enabled in Supabase
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Rate limiting enabled on API routes
- [ ] CORS properly configured for production domain
- [ ] LGPD compliance audit completed
- [ ] Security headers added (Content-Security-Policy, etc.)
- [ ] Performance optimizations applied
- [ ] Load testing completed (50+ concurrent users)
- [ ] User acceptance testing (UAT) completed

---

## 📞 Support & Issues

- **GitHub Issues:** https://github.com/tonicoelho/espectro-app/issues
- **Documentation:** See README.md and QUICKSTART.md
- **Methodology Questions:** See METHODOLOGY_AUDIT.md

---

**Last Updated:** January 6, 2026  
**Version:** 1.0  
**Status:** Ready for Testing
