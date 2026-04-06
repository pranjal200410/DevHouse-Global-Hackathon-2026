# Strict Judge Evaluation Report
**Date:** April 6, 2026  
**Evaluator Mode:** Senior-level hackathon judge (strict, detail-oriented)  
**Context:** 300+ participants, 5-6 days to submission  
**Scope:** 100% Pranjal's completed work

---

## Current Status Assessment

### ✅ What's Working Well
- **Full end-to-end flow:** Landing → Auth → Dashboard → Detail → Renewals
- **All verification checks pass:** `npm run verify` (typecheck + contracts + lint + build)
- **Clean architecture:** Monorepo with clear API/web separation
- **Contract-tested API:** Smoke tests validate core workflows
- **Deterministic demo data:** 10+ realistic subscriptions with renewal/dispute history
- **UI/UX Polish:** Good visual design, responsive, clear information hierarchy
- **TypeScript strict mode:** Both apps compile cleanly

### 📊 Current Win Probability: **20-30%**
### 📍 Finalist Probability: **40-50%**

---

## 8 Critical Findings (All in Pranjal's Scope)

### **HIGH SEVERITY** ❌

#### 1. **Optional/Weak Authentication (auth.ts)**
**File:** [apps/api/src/routes/auth.ts](apps/api/src/routes/auth.ts#L15)  
**Issue:** PIN is optional; login succeeds with just email
```typescript
if (payload.pin && payload.pin !== DEMO_PIN) {  // Only checks if pin WAS provided
  throw new AppError(401, "INVALID_CREDENTIALS", "Demo PIN is incorrect.");
}
```
**Judge Impact:** "Anyone can bypass PIN security. Your demo-safety claim is false."  
**Fix Time:** 10 minutes

---

#### 2. **Unauthenticated Reset Endpoint (auth.ts)**
**File:** [apps/api/src/routes/auth.ts](apps/api/src/routes/auth.ts#L54)  
**Issue:** `/v1/auth/demo-reset` has no auth guard; any concurrent judge/demo wipes shared state
```typescript
fastify.post("/auth/demo-reset", async (_request, reply) => {
  // NO requireAuth() call
  clearSessions();
  resetDemoState();
  return reply.status(200).send(toSuccess({ reset: true }));
});
```
**Judge Impact:** "If multiple evaluators run the demo simultaneously, they corrupt each other's data."  
**Fix Time:** 5 minutes

---

#### 3. **Global Mutable Demo State (demoState.ts)**
**File:** [apps/api/src/data/demoState.ts](apps/api/src/data/demoState.ts#L302)  
**Issue:** All users share one mutable `state` object; no per-user isolation
```typescript
let state = createInitialState();  // Shared across all sessions

export const updateDemoUserEmail = (email: string): User => {
  state.user.email = email.toLowerCase();  // Mutates global user
  state.user.name = email.split("@")[0]?.replace(/\./g, " ") || "Pranjal Demo";
  return getDemoUser();
};
```
**Judge Impact:** "Concurrent users interfere with each other. This is a fundamental isolation failure."  
**Fix Time:** 30 minutes (requires per-session state cloning)

---

#### 4. **Session Token Stored in localStorage (session-store.ts)**
**File:** [apps/web/lib/session-store.ts](apps/web/lib/session-store.ts#L17)  
**Issue:** Bearer token persisted to localStorage without XSS protection or client-side expiry check
```typescript
const storage = createJSONStorage<SessionStore>(() => {
  if (typeof window !== "undefined") {
    return window.localStorage;  // XSS-vulnerable storage
  }
  ...
});
```
**Judge Impact:** "Token theft via XSS is unmitigated. Security posture looks weak."  
**Fix Time:** 20 minutes (move to secure HTTP-only approach if possible, or add client-side expiry enforcement)

---

#### 5. **Next.js Has High-Severity Security Advisories (package.json)**
**File:** [apps/web/package.json](apps/web/package.json#L15)  
**Current Version:** `"next": "^14.2.35"`  
**Audit Output:**
```
next  9.5.0 - 15.5.13
Severity: high
- DoS via Image Optimizer remotePatterns
- HTTP request deserialization DoS
- HTTP request smuggling in rewrites
- Unbounded disk cache growth
```
**Judge Impact:** "Known vulnerabilities in production dependency. Red flag for engineering maturity."  
**Fix Time:** 5 minutes (upgrade to patch version or latest LTS)

---

### **MEDIUM SEVERITY** ⚠️

#### 6. **No Per-User Session Isolation (sessionStore.ts)**
**File:** [apps/api/src/lib/sessionStore.ts](apps/api/src/lib/sessionStore.ts#L5)  
**Issue:** In-memory session map; when user email changes, global state updates affect all viewers
**Judge Impact:** "You claim multi-user safety but have no real session segregation."  
**Fix Time:** 40 minutes

---

#### 7. **Persistence Architecture is Incomplete vs. Declared Stack (package.json, schema.prisma)**
**Files:** 
- [apps/api/package.json](apps/api/package.json#L20) (Prisma declared but unused)
- [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma#L2) (full schema defined)
- [apps/api/src/data/demoState.ts](apps/api/src/data/demoState.ts#L302) (runtime only in-memory)

**Issue:** Prisma and full DB schema are in dependencies but never initialized; entire app is in-memory  
**Judge Impact:** "Looks like prototype-only code. Production-readiness is questionable."  
**Fix Time:** 30 minutes (initialize SQLite or Postgres for real persistence)

---

#### 8. **Shallow Test Coverage (package.json, contractSmoke.ts)**
**Files:**
- [apps/api/package.json](apps/api/package.json#L12) (`"test": "echo \"No API unit tests configured yet\""`)
- [apps/api/src/scripts/contractSmoke.ts](apps/api/src/scripts/contractSmoke.ts#L15) (happy-path only)

**Issue:** Only 1 smoke script; no negative tests (invalid payloads, auth failures, state transitions)  
**Judge Impact:** "Any serious hackathon expects at least 15-20 focused tests for core logic."  
**Fix Time:** 60 minutes (add 10-15 test cases)

---

### **LOW-MEDIUM SEVERITY** 🔶

#### 9. **UX Inconsistency: Preview Link to Protected Route (page.tsx)**
**File:** [apps/web/app/page.tsx](apps/web/app/page.tsx#L23)  
**Issue:** Landing offers "View Dashboard Preview" but route requires auth token → redirect loop
```typescript
<Link href="/dashboard" className="cta-secondary">
  View Dashboard Preview
</Link>
```
Dashboard checks `if (!token)` and redirects to `/auth` → dead-end UX in first 30 seconds  
**Judge Impact:** "Small but immediate friction in the demo flow."  
**Fix Time:** 5 minutes (remove link or use static preview state)

---

## Pranjal's Completed Scope (Git Commit f81b903)

### Backend (apps/api/)
✅ `src/routes/auth.ts` – Auth endpoints (findings: 2, 4)  
✅ `src/routes/dashboard.ts` – Dashboard summary  
✅ `src/routes/subscriptions.ts` – Subscription operations  
✅ `src/routes/health.ts` – Health check  
✅ `src/lib/auth.ts` – Auth middleware  
✅ `src/lib/sessionStore.ts` – Session management (findings: 3, 6)  
✅ `src/lib/validation.ts` – Zod validators  
✅ `src/lib/schemas.ts` – Validation schemas  
✅ `src/lib/http.ts` – Response envelopes  
✅ `src/data/demoState.ts` – Demo state & mutations (findings: 3, 6, 7)  
✅ `src/scripts/contractSmoke.ts` – Contract tests (finding: 8)  
✅ `src/types.ts` – TypeScript types  
✅ `src/index.ts` – Fastify server setup  
✅ `API_CONTRACTS.md` – API documentation  
✅ `package.json` – Dependencies (finding: 5)  
✅ `tsconfig.json` – TS config  
✅ `prisma/schema.prisma` – DB schema (finding: 7)  

### Frontend (apps/web/)
✅ `app/page.tsx` – Landing (finding: 9)  
✅ `app/auth/page.tsx` – Login page  
✅ `app/dashboard/page.tsx` – Dashboard  
✅ `app/renewals/page.tsx` – Renewal calendar  
✅ `app/subscriptions/[id]/page.tsx` – Subscription detail  
✅ `app/layout.tsx` – Root layout  
✅ `app/globals.css` – Global styles  
✅ `lib/api.ts` – API client  
✅ `lib/session-store.ts` – Zustand session store (finding: 4)  
✅ `lib/types.ts` – TypeScript types  
✅ `lib/format.ts` – Formatting utilities  
✅ `components/app-header.tsx` – Header component  
✅ `components/metric-card.tsx` – Metric card  
✅ `components/status-badge.tsx` – Status badge  
✅ `package.json` – Dependencies (finding: 5)  
✅ `tsconfig.json` – TS config  
✅ `next.config.mjs` – Next config (finding: 7)  
✅ `tailwind.config.ts` – Tailwind config  
✅ `README.md` – Frontend docs  

### Root
✅ `README.md` – Main documentation  
✅ `package.json` – Monorepo config  

**Total:** 45+ files, all completed by Pranjal

---

## 5-6 Day Action Plan (Highest ROI Fixes)

### **Day 1-2: Security (Est. 1.5 hrs)** 
1. Fix auth: require PIN always (5 min)  
2. Protect `/demo-reset` with admin header or IP check (5 min)  
3. Upgrade Next.js to patch version (5 min)  
4. Run `npm audit` to confirm clean (2 min)  

### **Day 2-3: Session Isolation (Est. 2 hrs)**
1. Clone demo state per session on login (30 min)  
2. Update `updateDemoUserEmail` to use session-scoped state (15 min)  
3. Add per-session reset (10 min)  
4. Test concurrent access (15 min)  

### **Day 3-4: Persistence (Est. 1.5 hrs)**
1. Initialize SQLite for sessions + subscriptions (45 min)  
2. Migrate session store from Map to DB (30 min)  
3. Verify recovery after server restart (15 min)  

### **Day 4-5: Tests (Est. 1.5 hrs)**
1. Add 15 test cases:
   - Invalid PIN rejection (5 min)
   - Missing token → 401 (5 min)
   - Expired session → 401 (10 min)
   - Cancel invalid subscription → 404 (5 min)
   - Concurrent state mutations (15 min)
   - Missing required fields → 400 (10 min)
2. Ensure all pass (10 min)

### **Day 5-6: Polish & Validation (Est. 1 hr)**
1. Remove preview link or add static mockup (5 min)  
2. Final `npm run verify` (5 min)  
3. Local multi-browser concurrent demo test (20 min)  
4. Review README for judge clarity (10 min)  
5. Buffer (15 min)  

---

## Expected Outcome After Fixes
- **Security:** PIN enforced, reset protected, Next.js patched ✅  
- **Isolation:** Per-session state cloning ✅  
- **Persistence:** SQLite backing (or at least proper session lifecycle) ✅  
- **Testing:** 15+ focused tests passing ✅  
- **UX:** Clean demo flow, no dead links ✅  

**Revised Win Probability:** **45-60%** (up from 20-30%)  
**Reasoning:** Top 4 fixes address all HIGH findings and most MEDIUM findings. Tests + persistence move you into "serious builder" tier vs. "quick prototype."

---

## Summary for Judges (Pitch Adjustments)

**Before:** "Demo-first, deterministic, contract-tested."  
**After:** "Demo-first, session-isolated, persistence-backed, thoroughly tested."

---

## References
- **Verification Command:** `npm run verify` (must pass)
- **Contract Tests:** `npm run qa:contracts` (all 14 assertions)
- **Build:** Both `npm run build:api` and `npm run build:web` must succeed
- **Demo Flow:** Landing (10s) → Auth → Dashboard → Detail → Renewals (< 2 min total)

---

**Generated:** 2026-04-06 | **Scope:** 100% Pranjal | **Status:** Actionable Plan Ready
