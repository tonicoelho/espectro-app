# 🇧🇷 Espectro Quick Reference Card

**Status:** Ready for Testing | **Last Updated:** January 6, 2026

---

## ⚡ 30-Second Status

✅ **Python scraper pipeline:** Working (20+ articles extracted)  
✅ **Data quality:** Verified (proper JSON format)  
⏳ **Backend:** Ready after `npm install` + `.env`  
⏳ **Frontend:** Ready after `npm install`  
⏳ **Database:** Waiting for Supabase setup + API keys  

---

## 🚀 Quick Start (Copy & Paste)

### Setup (First Time)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Scrapers
cd scrapers
python run_scrapers.py

# Terminal 4: Process Articles
cd backend
ts-node src/scripts/process-scraped-articles.ts --all
```

### Daily Use
```bash
# Start backend
npm run dev  # in /backend

# Start frontend  
npm run dev  # in /frontend

# Run scrapers
python run_scrapers.py  # in /scrapers
```

---

## 📝 Configuration Checklist

**CRITICAL - Do these first:**
- [ ] Get OpenAI API key
- [ ] Get Google Gemini API key
- [ ] Create Supabase account
- [ ] Get Supabase credentials
- [ ] Update `.env` files in `scrapers/` and `backend/`

**IMPORTANT - Do these second:**
- [ ] Run Supabase SQL schemas
- [ ] Run `npm install` in backend/ and frontend/
- [ ] Run `pip install -r requirements.txt` in scrapers/

**GOOD TO HAVE:**
- [ ] Get Twilio credentials for WhatsApp bot
- [ ] Test all three scrapers
- [ ] Verify database tables created

---

## 🔗 Important URLs

```
Local Development:
  Backend API:     http://localhost:3000
  Backend Health:  http://localhost:3000/health
  Frontend App:    http://localhost:3001 (or next port)
  
External Services:
  Supabase:        https://supabase.com/dashboard
  OpenAI:          https://platform.openai.com/api-keys
  Google AI:       https://ai.google.dev
  Twilio Console:  https://www.twilio.com/console
  GitHub Repo:     https://github.com/tonicoelho/espectro-app
```

---

## 📊 Component Status

| Component | Status | Action |
|-----------|--------|--------|
| Python Env | ✅ Ready | None |
| Scrapers | ✅ Working | Test regularly |
| Backend | ⏳ Ready | npm install + .env |
| Frontend | ⏳ Ready | npm install |
| Database | ⏳ Ready | Setup + .env |
| WhatsApp | ⏳ Ready | Twilio .env |

---

## 🔑 Environment Variables

### scrapers/.env
```bash
OPENAI_API_KEY=sk-...
GOOGLE_GEMINI_API_KEY=...
DATA_LITE_MODE=true
BACKEND_API_URL=http://localhost:3000/api/v1
```

### backend/.env
```bash
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...
GOOGLE_GEMINI_API_KEY=...
PORT=3000
```

### frontend/.env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 🧪 Testing Commands

```bash
# Health check
curl http://localhost:3000/health

# Scrape test (single source)
python run_scrapers.py --source g1

# Scrape all (verbose)
python run_scrapers.py --verbose

# Process articles from JSON
ts-node src/scripts/process-scraped-articles.ts --all

# View latest articles
cat scrapers/output/g1_*.json | jq '.articles[0]'
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found" | `pip install -r requirements.txt` in scrapers/ |
| Port 3000 in use | `PORT=3001 npm run dev` |
| "SUPABASE_URL missing" | Add to `.env` file |
| Scraper timeout | Increase CRAWL_DELAY in config.py |
| Articles not clustering | Check similarity threshold |

---

## 📚 Documentation Map

| Document | Purpose | Read Time |
|----------|---------|-----------|
| SETUP_COMPLETION_SUMMARY.md | Overview of work done | 5 min |
| TESTING_GUIDE.md | How to test components | 20 min |
| TESTING_REPORT.md | Verification results | 10 min |
| OPERATIONS_RUNBOOK.md | Daily operations | 15 min |
| METHODOLOGY_AUDIT.md | Bias framework | 30 min |
| spec.md | Full tech specs | 45 min |

---

## 🎯 Success Indicators

✅ **Pipeline working when:**
- Scrapers run without errors
- JSON files generate in output/
- Backend processes articles without crashing
- Frontend loads at localhost:3001
- Supabase has 20+ articles

✅ **Bot working when:**
- Responds to WhatsApp messages
- Returns bias scores (0-100)
- Generates magic links
- <10 second response time

---

## 🚀 Next Actions (Today)

1. **Get API keys** (15 min)
   - OpenAI, Gemini, Supabase, Twilio

2. **Update .env files** (5 min)
   - Add credentials to all environments

3. **Setup Supabase** (20 min)
   - Create account and run schemas

4. **Install dependencies** (10 min)
   - `npm install` in backend/ and frontend/

5. **Run end-to-end test** (30 min)
   - Start all 4 components and verify

---

## 💡 Pro Tips

- Use `--verbose` flag with scrapers to see detailed logs
- Use `jq` to parse JSON output: `jq '.articles[0]' file.json`
- Test one component at a time before combining
- Keep browser DevTools open (F12) for frontend debugging
- Save API keys in a secure location (not git repo!)

---

## 📞 Need Help?

1. Check the relevant documentation file
2. Search GitHub issues for similar problems
3. Review TESTING_GUIDE.md for detailed procedures
4. Check OPERATIONS_RUNBOOK.md troubleshooting section

---

**Status:** ✅ Ready to Test  
**Next:** Configure API keys and run first end-to-end test  
**Questions?** See TESTING_GUIDE.md or OPERATIONS_RUNBOOK.md
