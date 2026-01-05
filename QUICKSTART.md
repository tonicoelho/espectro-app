# 🚀 Espectro - Quick Start Guide

Get the Espectro project up and running in **5 minutes**!

---

## What You Just Bootstrapped

✅ **Backend API** - Node.js + TypeScript + Express
✅ **Database Schemas** - PostgreSQL tables for sources, articles, clusters, users
✅ **AI Bias Analysis** - GPT-4 Turbo prompt template (with Z-Axis focus)
✅ **Methodology Audit** - Gemini 1.5 Pro validation framework
✅ **Mobile App Structure** - Flutter project ready to be created

---

## 🏃 Run the Backend (Right Now)

The backend server is **already running** on `http://localhost:3000`!

### Test it:
```bash
curl http://localhost:3000/health
```

**Expected output:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T...",
  "version": "v1",
  "environment": "development"
}
```

### Check API endpoints:
```bash
curl http://localhost:3000/api/v1/
```

---

## 📦 What's Inside

```
espectro-app/
├── backend/                       ← YOU ARE HERE
│   ├── src/
│   │   ├── server.ts             ✅ Express server (running!)
│   │   └── services/
│   │       └── biasAnalysisPrompt.ts  ✅ AI prompts for bias analysis
│   ├── database/schemas/          ✅ 7 SQL schema files
│   └── package.json               ✅ Dependencies installed
│
├── spec.md                        ✅ Full project specification
├── METHODOLOGY_AUDIT.md           ✅ Gemini validation process
└── README.md                      ✅ Complete documentation
```

---

## 🎯 Your Next Steps

### 1. Set Up Your Environment Variables

```bash
cd backend
cp .env.example .env
```

**Edit `.env` and add your API keys:**
- `OPENAI_API_KEY` - For bias analysis (get from https://platform.openai.com)
- `GOOGLE_GEMINI_API_KEY` - Fallback AI (get from https://ai.google.dev)
- `DATABASE_URL` - PostgreSQL connection string (or use Supabase)

### 2. Create the Database

**Option A: Use Supabase** (Recommended - LGPD compliant hosting)
1. Sign up at https://supabase.com
2. Create a new project
3. Copy the connection string to `.env`
4. Run the schemas:
   ```bash
   # Connect via Supabase SQL Editor or psql
   psql YOUR_DATABASE_URL

   \i database/schemas/001_create_sources_table.sql
   \i database/schemas/002_create_articles_table.sql
   \i database/schemas/003_create_story_clusters_table.sql
   \i database/schemas/004_create_users_table.sql
   \i database/schemas/005_create_user_activity_table.sql
   \i database/schemas/006_create_whatsapp_bot_logs_table.sql
   \i database/schemas/007_create_materialized_views.sql
   ```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL (if needed)
# Ubuntu/Debian: sudo apt-get install postgresql
# macOS: brew install postgresql

# Create database
createdb espectro_db

# Run schemas
psql espectro_db
\i database/schemas/001_create_sources_table.sql
# ... (repeat for all schemas)
```

### 3. Create the Flutter Mobile App

```bash
# Install Flutter first: https://flutter.dev/docs/get-started/install

cd espectro-app
flutter create espectro_mobile
cd espectro_mobile

# Run on emulator or device
flutter run
```

### 4. Run the Methodology Audit with Gemini

📋 **See [`METHODOLOGY_AUDIT.md`](./METHODOLOGY_AUDIT.md)** for the complete process.

**Quick version:**
1. Get Gemini API key: https://ai.google.dev
2. Copy the audit prompt from `METHODOLOGY_AUDIT.md` Step 2
3. Run it against Gemini 1.5 Pro
4. Implement the NLP adjustments it suggests

This validates your bias framework is robust enough for Brazilian politics!

---

## 🔥 Key Features to Implement Next

Based on the 16-week roadmap in `spec.md`:

### Week 3-5: Data Pipeline
- [ ] Build RSS aggregator (Python)
- [ ] Create web scrapers (Scrapy)
- [ ] Integrate OpenAI bias analysis
- [ ] Implement story clustering

**Files to create:**
- `backend/src/services/rssAggregator.py`
- `backend/src/services/articleScraper.py`
- `backend/src/services/biasAnalyzer.ts`
- `backend/src/services/storyClustering.ts`

### Week 6-9: Core Features
- [ ] Comparison Slider UI (Flutter)
- [ ] Blindspot Detector algorithm
- [ ] Data-Lite Mode implementation

**Mobile app screens to create:**
- `espectro_mobile/lib/screens/home_screen.dart`
- `espectro_mobile/lib/screens/comparison_slider.dart`
- `espectro_mobile/lib/screens/blindspot_feed.dart`

---

## 🛠 Development Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build

# Mobile (after flutter create)
cd espectro_mobile
flutter run          # Run on connected device/emulator
flutter build apk    # Build Android APK
flutter build ios    # Build iOS app (macOS only)
```

---

## 🎨 Important Design Decisions (Per Your Request)

### 1. Z-Axis (Institutionalism) Focus

From `backend/src/services/biasAnalysisPrompt.ts`:

```typescript
// Z-Axis is the MOST IMPORTANT differentiator for 2026
// The divide is "Pro-STF" vs "Anti-STF", not just Left/Right

Pro-Establishment indicators:
- "defesa da democracia", "Estado de Direito"
- "decisão do STF", "respeito às instituições"

Anti-System indicators:
- "ativismo judicial", "ditadura do judiciário"
- "censura", "perseguição política"
```

**Your prompt explicitly weights these terms!**

### 2. WhatsApp Bot (Growth Hack)

Priority for Phase 2 (Week 10). Setup:
1. Get Twilio WhatsApp Business account
2. Create webhook: `backend/src/routes/whatsapp.ts`
3. Target: <10 second response time

### 3. Data-Lite Mode (Critical for Brazil)

**Implementation in Flutter:**
```dart
// In your Image.network widget:
if (user.dataLiteMode) {
  return SizedBox(
    width: 200,
    height: 150,
    decoration: BoxDecoration(
      border: Border.all(color: biasColor, width: 3),
    ),
  );
} else {
  return Image.network(imageUrl);
}
```

45% of Brazilians use prepaid plans - this feature is **essential** for market penetration!

---

## 📊 Success Metrics (Remind Yourself)

**Year 1 Targets (from spec.md):**
- 100,000+ monthly active users by October 2026
- 50+ news sources classified
- 95%+ uptime during breaking news
- <2 second load time on 3G
- Net Promoter Score > 40

**Break-even:** 688 premium subscribers (~23k total users at 3% conversion)

---

## 🚨 Critical Path Items

Before you can launch (March 2026):

1. **Legal:** Finalize Terms of Service + Privacy Policy (LGPD compliance)
2. **Infrastructure:** Set up AWS account in São Paulo region (`sa-east-1`)
3. **Content:** Classify initial 50 news sources with expert panel
4. **AI:** Validate bias analysis accuracy >85% vs. human experts
5. **Testing:** Load test for 100k concurrent users (election day spike)

---

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process and restart
npm run dev
```

### TypeScript errors?
```bash
# Rebuild
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection fails?
- Check `.env` has correct `DATABASE_URL`
- Verify PostgreSQL is running: `pg_isready`
- Test connection: `psql $DATABASE_URL`

---

## 📚 Learn More

- **Full Spec:** [`spec.md`](./spec.md) - 1,200+ lines of detailed requirements
- **Methodology:** [`METHODOLOGY_AUDIT.md`](./METHODOLOGY_AUDIT.md) - How to validate bias framework
- **API Docs:** `http://localhost:3000/api/v1/` (when server is running)

---

## 🎉 You're Ready!

You now have:
✅ A running backend API
✅ Complete database schemas
✅ AI bias analysis prompts (Z-Axis focused)
✅ Methodology validation framework
✅ 16-week roadmap to launch

**Next milestone:** Complete Phase 1 (Data Pipeline) by Week 5.

Good luck building Brazil's first news bias tracker! 🇧🇷

---

**Questions?** Review `spec.md` or check the roadmap in `README.md`.
