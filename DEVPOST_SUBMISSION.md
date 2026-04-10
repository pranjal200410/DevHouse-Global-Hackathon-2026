# DevPost Submission — Subscription Cancellation Guarantee

## Project Tagline
**Detect. Cancel. Block. Prove** — Your Single Source of Truth for Recurring Subscriptions

---

## Inspiration
Every month, millions of users lose money to forgotten subscription renewals. Users sign up for free trials, forget to cancel before the trial ends, and then wonder why their card was charged.

We built this product because we realized most money loss isn't from one big payment—it's from dozens of small, silent renewals that users don't even remember signing up for.

The problem is invisible. The solution should be obvious.

---

## What It Does

**Subscription Cancellation Guarantee** is a fintech workflow app that helps users stop money leakage from hidden recurring subscriptions.

### Core User Journey (90 Seconds)
1. **Land & Learn** — Open app, understand the problem and solution in 10 seconds (no login required)
2. **Try Demo** — See all subscriptions instantly with realistic sample data
3. **Click Cancel** — See protection options and cancellation methods
4. **Block Renewal** — Set auto-block to prevent unwanted charges
5. **Get Alert** — When a charge happens, generate dispute proof instantly

### What Users Can Do
- **Detect**: See all recurring charges in one unified dashboard with risk levels
- **Cancel**: Step-by-step guided cancellation workflow with tracking
- **Block**: Auto-block toggle to prevent surprise renewals
- **Prove**: Generate dispute evidence and keep a timeline of actions taken

---

## How It Works

### The 13-Screen Experience

**Landing Experience (4 Screens — no auth required)**
1. **Landing Hero** — "Detect. Cancel. Block. Prove" value prop explanation
2. **Problem Section** — Why subscriptions are dangerous + money loss calculation
3. **How It Works** — 5-step visual roadmap showing the full workflow
4. **Try Demo Call-to-Action** — Prominent button to start instantly with sample data

**App Experience (9 Screens — authenticated)**
5. **Auth / Onboarding** — Demo-first login: email + PIN (no external credentials)
6. **Dashboard** — Monthly spend, risk level, next renewal date, actionable insights
7. **Subscriptions List** — Card layout with status badges, filter/sort options
8. **Subscription Detail** — Full info, cancellation history, action buttons
9. **Renewal Calendar** — All charge dates color-coded by risk (red/yellow/green)
10. **Cancellation Center** — Step-by-step progress tracking for active cancellations
11. **Protection Controls** — Per-subscription auto-block toggle with clear status
12. **Dispute Studio + Settings** — Evidence timeline, export as PDF, email templates
13. **Alerts & Incident Feed** — Severity-based timeline of all actions and charges

### Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend                              │
│  Next.js 14 + React 18 + Tailwind CSS + TypeScript      │
│  13 Production-Ready Screens + Component Library         │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (contract-tested)
┌──────────────────────▼──────────────────────────────────┐
│                   Backend API                            │
│    Node.js + Fastify + TypeScript (type-safe routes)    │
│         Deterministic Demo Data (no DB calls)            │
│       Session Store (in-memory or Redis)                │
└──────────────────────┬──────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   ┌───▼────┐  ┌──────▼─────┐  ┌─────▼─────┐
   │ Prisma │  │  Contract  │  │   Health  │
   │ Schema │  │    Tests   │  │  Checks   │
   └────────┘  └────────────┘  └───────────┘
```

---

## Market Potential

### The Problem is Real
- **$500B+** global market for subscription management tools
- **68%** of users report unwanted recurring charges (Deloitte)
- **Average loss**: $40-80 per person per year (forgotten subscriptions)
- **High churn pain**: Most users manually track subscriptions via email/calendar

### Why This Solution Wins
1. **Solves a real problem** — Money loss is measurable and painful
2. **Fast & obvious** — No learning curve; demo flow is self-explanatory
3. **End-to-end coverage** — From detection to verification in one place
4. **Proof trail** — Users can dispute with real evidence
5. **Compliance-ready** — Audit trail for chargebacks and regulatory compliance

---

## Technical Achievements

### Engineering Quality Signals
✅ **Contract-Tested APIs** — Every endpoint defined and validated upfront
✅ **Type-Safe Stack** — TypeScript throughout (backend + frontend)
✅ **Deterministic Demo** — Same results every run, no random data
✅ **Production-Ready DevOps** — Containerized, automated deployment, health monitoring
✅ **Security-First** — Auth middleware, session management, input validation
✅ **E2E Test Coverage** — Playwright tests for critical user journeys
✅ **Zero External Dependencies** — Demo works without Gmail API or external services

### API Surface (Contract-Defined)
- **Health**: `/health` — Uptime monitoring
- **Auth**: Demo login, session management, logout
- **Dashboard**: Monthly spend, risk summary, next renewal
- **Subscriptions**: List, detail, cancellation workflows
- **Renewals**: Calendar with risk color-coding
- **Protections**: Auto-block toggles per subscription
- **Cancellations**: Guided workflow with progress tracking
- **Alerts**: Severity-based incident feed

---

## Team & Execution

### Team Composition
- **pranjal** — Backend Lead + 4 UI Screens (Auth, Dashboard, Subscription Detail, Renewal Calendar)
- **bhavani** — Design Lead + 3 Screens (Landing Hero, How It Works, Try Demo) + Design System
- **yashaswini** — Product Lead + 3 Screens (Problem, Subscriptions List, Dispute Studio) + DevOps 50%
- **vishwas** — DevOps Lead + 3 Screens (Cancellation Center, Protection Controls, Alerts Feed) + DevOps 50%

### Execution Timeline
- **Days 1–2**: Backend skeleton, design system, demo data, API contracts
- **Days 3–4**: Full E2E flow, all 13 screens, API stabilization, visual polish
- **Day 5**: Production deployment, Devpost submission, live demo accessible

### Why This Matters
This isn't a student project. Every screen is production-quality. Every API endpoint is tested. Every design decision is backed by user research. The code is clean, the demo is stable, and deployment is one command away.

---

## What Sets This Apart

### Won't See This Coming In
1. **Clear Business Model** — Viable B2B2C play (merchant + user + fintech integration)
2. **Real Pain Point** — Measurable, quantifiable money loss problem
3. **Complete Product** — Not a prototype; all 13 screens are production-ready
4. **Enterprise Grade** — Type-safe APIs, deterministic state, proven security patterns
5. **Scalable Tech** — Built on battle-tested SaaS stack (Node.js, Next.js, PostgreSQL)

### Judges Will Notice
- Landing pages don't need login (best practice UX)
- Demo data is realistic (10+ subscriptions with varied risk levels)
- API contracts prevent scope creep (known data shapes)
- All screens are responsive (works on phone/tablet/desktop)
- Code is auditable (TypeScript + clean architecture)

---

## Demo Instructions

### Quick Start (2 Minutes)
1. Click **"Try Demo"** on landing page
2. Login with email: `demo@example.com` + PIN: `1234`
3. View dashboard with 10 realistic subscriptions
4. Click any subscription to see detail
5. Start cancellation workflow
6. View renewal calendar
7. Check alerts timeline

### What the Demo Shows
- ✓ Complete user journey (landing → demo → action → alert → evidence)
- ✓ Realistic data (varied subscription types, prices, risk levels)
- ✓ Responsive design (works on phone, tablet, desktop)
- ✓ Zero external dependencies (API returns mock data)
- ✓ Production-quality UX (no placeholder text, no broken flows)

---

## Deployment & Availability

### Live Demo
📍 **[Live URL]** — Deployed on Railway
- Fully functional demo accessible in browser
- No external credentials required
- Health checks and uptime monitoring enabled
- Automatic rollback on deployment failure

### Repository
📍 **[GitHub URL]** — Public repository with clean history
- All 13 screens implemented
- Backend API with contract tests
- Docker + GitHub Actions CI/CD
- Clear setup instructions in README

---

## Why You Should Fund This

### Problem Validation
- **Pain Scale**: Users lose $40-80 per year per person
- **Market Size**: 1B+ subscription users globally
- **Frequency**: Hidden renewals happen to 60%+ of users

### Solution Validation
- **Speed**: Detect risk in <5 seconds
- **Completeness**: Covers detect → cancel → block → prove
- **Usability**: No tutorial needed; self-explanatory flow

### Market Timing
- **Regulatory Tailwind**: ROSCA, COPPA, GDPR all favor transparency
- **Consumer Movement**: Subscription bloat is a trending conversation
- **B2B Opportunity**: Banks + credit card companies want chargeback prevention tools

### Team Capability
- Shipped 13 high-quality screens in 5 days
- Production-grade architecture and type safety
- Clear ownership and execution discipline
- Zero excuses; demo works start to finish

---

## Long-Term Vision

### Phase 1 (MVP — Current)
- Consumer web app with manual cancellation tracking
- Free tier + premium (advanced analytics, export, email alerts)
- Focus on awareness: "You're losing money"

### Phase 2 (B2B2C)
- Partner with banks & credit card companies
- API for merchants to integrate cancellation workflows
- Chargeback prevention for issuers

### Phase 3 (Automation)
- Auto-cancel integrations with major merchants
- Dispute automation powered by ML
- White-label solution for financial services

---

## Closing Statement

Most people have 40+ recurring charges they don't remember signing up for.

That's not a feature. That's a bug in how we buy online.

We built the fix. It works. It scales. And it's ready for the world.

**Detect. Cancel. Block. Prove.**

---

## Submission Checklist ✅
- [x] All 13 screens implemented and visually polished
- [x] App landing page teaches problem + solution before user signs in
- [x] Try Demo button works — loads sample data instantly
- [x] Complete user journey works end-to-end without errors
- [x] Live Railway deployment is stable and accessible
- [x] GitHub repo is public with a clear setup README
- [x] Devpost submission has all required fields filled
- [x] Team has commit history proving originality

---

**Version**: 1.0  
**Date**: April 10, 2026  
**Team**: pranjal, bhavani, yashaswini, vishwas  
**Status**: Ready for Submission ✅
