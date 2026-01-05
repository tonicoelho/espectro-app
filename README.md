# 🇧🇷 Espectro - Brazilian News Bias Tracker

**"See the same news from all sides — before you decide."**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Espectro is Brazil's first comprehensive news bias tracking platform designed to help citizens navigate political polarization during the 2026 elections and beyond.

---

## 📋 Table of Contents

- [Vision](#-vision)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Roadmap](#-development-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Vision

Create Brazil's first comprehensive news bias tracking platform that helps citizens:
- Break free from echo chambers
- Navigate WhatsApp misinformation
- Compare how different political perspectives frame the same stories
- Make informed decisions in the 2026 elections

**Target Launch:** Q1 2026 (Pre-Election Positioning)

---

## ✨ Key Features

### MVP Features (Launch - March 2026)

1. **Comparison Slider**
   - See the same story from Left, Center, and Right perspectives
   - Swipe between different outlets covering the same event
   - Transparent bias scoring (0-100 polarization index)

2. **Blindspot Detector**
   - Discover what stories YOUR side isn't covering
   - Break out of filter bubbles
   - Implicit preference tracking (LGPD-compliant)

3. **WhatsApp Bot Integration**
   - Forward suspicious links to verify bias
   - Get instant analysis in <10 seconds
   - Privacy-first: No message content stored

4. **Data-Lite Mode**
   - Optimized for prepaid mobile plans (45% of Brazilian market)
   - Text-only view, aggressive caching
   - <500KB per session target

5. **Source Directory**
   - 50+ news sources classified
   - Ownership transparency
   - Historical bias drift tracking

### Multi-Dimensional Bias Framework

Unlike US-centric tools, Espectro uses a **Brazilian-first** framework:

#### X-Axis: Economic (Market vs. State)
- **+5:** Privatization, fiscal austerity, free trade
- **-5:** Social programs, state intervention

#### Y-Axis: Social (Progressive vs. Conservative)
- **+5:** LGBTQ+ rights, secularism, environmental policy
- **-5:** Religious values, traditional family, law & order

#### Z-Axis: Institutionalism (MOST IMPORTANT FOR 2026)
- **+5:** Pro-STF, respect for democratic institutions
- **-5:** Anti-STF, "anti-establishment"

**Key Insight:** The 2026 divide is not Left vs. Right, but **Pro-STF vs. Anti-STF**.

---

## 🛠 Technology Stack

### Frontend
- **Mobile:** Flutter (iOS + Android)
  - Cross-platform, excellent offline support
  - Target: <2s load time on 3G
- **Web:** Next.js 14 + Tailwind CSS
  - SEO-friendly, server-side rendering

### Backend
- **API:** Node.js + TypeScript + Express
  - AWS Lambda + API Gateway (Serverless for election traffic spikes)
- **Database:** Supabase (Managed PostgreSQL)
  - Built-in auth, LGPD-compliant
- **Cache:** Redis (ElastiCache)
- **Storage:** AWS S3 (São Paulo region `sa-east-1`)

### AI & Data Pipeline
- **Bias Analysis:** OpenAI GPT-4 Turbo
  - Fallback: Google Gemini 1.5 Pro
  - See `METHODOLOGY_AUDIT.md` for validation process
- **News Aggregation:**
  - Python (Feedparser) for RSS feeds
  - Scrapy for web scraping
  - AWS SQS for job queuing

### Infrastructure
- **Hosting:** AWS (São Paulo region for low latency)
- **CDN:** CloudFront
- **Monitoring:** Sentry + Grafana
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```
espectro-app/
├── backend/                    # Node.js + TypeScript API
│   ├── src/
│   │   ├── server.ts          # Express server
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   │   └── biasAnalysisPrompt.ts  # AI prompts (Z-Axis focus)
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Auth, LGPD compliance
│   │   └── utils/             # Helpers
│   ├── database/
│   │   ├── schemas/           # SQL table definitions
│   │   │   ├── 001_create_sources_table.sql
│   │   │   ├── 002_create_articles_table.sql
│   │   │   ├── 003_create_story_clusters_table.sql
│   │   │   ├── 004_create_users_table.sql
│   │   │   ├── 005_create_user_activity_table.sql
│   │   │   ├── 006_create_whatsapp_bot_logs_table.sql
│   │   │   └── 007_create_materialized_views.sql
│   │   └── migrations/        # Database migration scripts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── espectro_mobile/           # Flutter mobile app (iOS + Android)
│   ├── lib/
│   │   ├── main.dart
│   │   ├── screens/           # UI screens
│   │   ├── widgets/           # Reusable components
│   │   ├── services/          # API client
│   │   └── models/            # Data models
│   └── pubspec.yaml
│
├── web/                       # Next.js web app (future)
│   └── (to be created)
│
├── spec.md                    # Comprehensive project specification
├── METHODOLOGY_AUDIT.md       # Gemini 1.5 Pro validation process
└── README.md                  # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (for backend)
- **Flutter** 3.0+ (for mobile app)
- **PostgreSQL** 14+ (or Supabase account)
- **Redis** (for caching)
- **AWS Account** (for production deployment)

### Backend Setup

1. **Clone the repository**
   ```bash
   cd espectro-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database credentials
   ```

4. **Initialize database**
   ```bash
   # Connect to your PostgreSQL instance
   psql -U your_user -d espectro_db

   # Run schema files in order
   \i database/schemas/001_create_sources_table.sql
   \i database/schemas/002_create_articles_table.sql
   \i database/schemas/003_create_story_clusters_table.sql
   \i database/schemas/004_create_users_table.sql
   \i database/schemas/005_create_user_activity_table.sql
   \i database/schemas/006_create_whatsapp_bot_logs_table.sql
   \i database/schemas/007_create_materialized_views.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server will be available at: `http://localhost:3000`

### Mobile App Setup

1. **Install Flutter**
   - Follow official guide: https://flutter.dev/docs/get-started/install

2. **Create Flutter project** (if not already created)
   ```bash
   cd espectro-app
   flutter create espectro_mobile
   ```

3. **Run the app**
   ```bash
   cd espectro_mobile
   flutter pub get
   flutter run
   ```

### Testing the Setup

```bash
# Test backend health
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"2026-01-05T...","version":"v1","environment":"development"}
```

---

## 📅 Development Roadmap

Based on `spec.md` - 16-week development plan:

### Phase 0: Foundation (Weeks 1-2) ✅
- [x] Set up GitHub repository
- [x] Create database schema
- [x] Build basic backend scaffold
- [x] Create AI bias analysis prompt template
- [ ] Configure AWS account + Supabase project

### Phase 1: Data Pipeline (Weeks 3-5)
- [ ] Build RSS aggregator (Python script)
- [ ] Develop 10 custom scrapers for non-RSS sources
- [ ] Implement OpenAI bias analysis integration
- [ ] Create story clustering algorithm
- [ ] Test with 30-day historical data

### Phase 2: Core Features (Weeks 6-9)
- [ ] Comparison Slider UI (mobile + web)
- [ ] Source Directory with bias maps
- [ ] Blindspot Detector algorithm
- [ ] Data-Lite Mode toggle
- [ ] User authentication (Supabase Auth)

### Phase 3: WhatsApp Integration (Week 10)
- [ ] Set up Twilio WhatsApp Business account
- [ ] Build Lambda webhook for bot
- [ ] Test with 20 beta users
- [ ] Optimize response time (<10s)

### Phase 4: Premium Features (Weeks 11-12)
- [ ] Political Intelligence dashboard
- [ ] Stripe payment integration
- [ ] Advanced filtering (region, media type)
- [ ] Historical archive access

### Phase 5: Testing & Polish (Weeks 13-14)
- [ ] Load testing (simulate 100k users)
- [ ] Security audit (LGPD compliance check)
- [ ] User acceptance testing (UAT) with 50 beta testers
- [ ] Fix critical bugs, polish UI

### Phase 6: Launch Preparation (Week 15)
- [ ] Finalize Terms of Service + Privacy Policy
- [ ] Set up monitoring (Sentry, Grafana)
- [ ] Create onboarding tutorial
- [ ] Prepare launch marketing materials
- [ ] Submit app to App Store/Google Play

### Phase 7: Soft Launch (Week 16 - March 2026)
- [ ] Release to waitlist subscribers
- [ ] Monitor performance and user feedback
- [ ] Iterate based on first 1,000 users
- [ ] Begin paid marketing campaigns

**Target:** 100,000+ monthly active users by October 2026 (election month)

---

## 🔬 Methodology Audit

We use **Gemini 1.5 Pro** as a "red team" to validate our bias framework before launch.

See [`METHODOLOGY_AUDIT.md`](./METHODOLOGY_AUDIT.md) for:
- How we test framework robustness
- Edge cases (agribusiness, religious topics, STF decisions)
- Regional bias detection (Center-West vs. Southeast)
- NLP adjustments for 2026 political context

**Key Refinements:**
1. **Z-Axis Focus:** "Pro-STF vs. Anti-STF" is THE divide in 2026
2. **Regional Context:** Detect when urban sources miss agricultural perspectives
3. **Action-Framing Matrix:** Track how different outlets frame the same STF decision

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Beta Testing:** Sign up at [espectro.app](https://espectro.app) (coming soon)
2. **Source Classification:** Help classify Brazilian news sources
3. **Bug Reports:** Open an issue on GitHub
4. **Code Contributions:** Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Ensure LGPD compliance for user data

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Website:** [espectro.app](https://espectro.app) (coming soon)
- **Email:** contact@espectro.app
- **Twitter:** [@EspectroApp](https://twitter.com/EspectroApp)

---

## 🙏 Acknowledgments

- Inspired by AllSides.com (US) and Ground News (Canada)
- Built for the unique context of Brazilian democracy
- Designed with LGPD (Brazilian data privacy law) compliance from day one

---

**Made with ❤️ for Brazilian democracy**

*Target Launch: Q1 2026 - Before the elections that will shape Brazil's future*