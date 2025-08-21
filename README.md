# Open SaaS Valuation Calculator

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-blue.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A modern web application for calculating early-stage SaaS and app valuations using multiple methodologies and advanced analytics.

## 📋 Overview

This calculator provides data-driven valuations based on:
- **Revenue metrics** (MRR, profit margins, fixed costs)
- **User traction** (registrations, conversion rates, visitor traffic)
- **Social media presence** (platform-specific follower valuations)
- **Market positioning** (category analysis with B2B SaaS, Mobile App, Game, B2C App, Other)

Created by [viberank.dev](https://viberank.dev) - A platform to boost your app's visibility and drive more traffic from the tech community.

## 🎥 Demo

[![Demo Video](https://img.youtube.com/vi/do8ezP-TtB4/maxresdefault.jpg)](https://www.youtube.com/watch?v=do8ezP-TtB4)

## 🚀 Quick Start

```bash
git clone https://github.com/viberank-dev/open-saas-valuation.git
cd open-saas-valuation
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## ⚙️ How It Works

### Valuation Methods

1. **Revenue-Based**: ARR × 6x industry multiple
2. **User-Based Projected ARR**: Registrations × conversion rate × pricing × 12 months × 6x
3. **Social Media Value**: Followers × platform rates ($0.1-$2.0 per follower)

### Key Features

- **Enhanced Confidence Analysis**: 100-point scoring across revenue maturity, profitability, user engagement, market positioning, and social proof
- **Smart Conversion Rates**: Custom rates or category defaults (B2B SaaS: 2-6%, Apps: 1-3%)
- **Detailed Insights**: Profit margin analysis, cost efficiency, strategic recommendations
- **Responsive Design**: Modern dark-mode interface with mobile optimization

### Input Categories

**Financial Performance**
- Monthly Recurring Revenue (MRR)
- Monthly Recurring Profit (MRP)  
- Conversion Rate (Registration to Paid %)
- Fixed Monthly Costs (servers, domain, LLM, ads...)

**User Traction**
- Registrations per Month
- Unique Visitors per Month
- App Category (B2B SaaS, Mobile App, Game, B2C App, Other)
- Average Service Price

**Social Media Presence**
- LinkedIn, X (Twitter), Instagram, TikTok, YouTube followers
- Reddit Karma

## 🏗️ Production Build

```bash
npm run build
```

Files output to `dist/` directory.

## ⚠️ Important Disclaimer

This tool provides estimates based on industry benchmarks and should not be considered professional financial advice. Actual valuations vary significantly based on market conditions, competitive landscape, team experience, and revenue quality.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **[Viberank.dev](https://viberank.dev)**
- **[LinkedIn](https://www.linkedin.com/company/viberank.dev/)**
- **[X / Twitter](https://x.com/viberank)**