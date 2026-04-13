# PRANJAL'S FIX CHECKLIST (5-6 Days)

## Critical Fixes (Must Do)

### ✅ Auth Security (15 min)
- [x] Make PIN required in `apps/api/src/routes/auth.ts` line 15
  ```typescript
  // Before: if (payload.pin && payload.pin !== DEMO_PIN)
  // After: if (!payload.pin || payload.pin !== DEMO_PIN)
  ```
  
- [x] Add auth guard to `/demo-reset` endpoint line 54
  ```typescript
  // Before: export const registerAuthRoutes = (fastify: FastifyInstance)
  // Add: const auth = requireAuth(request); at start of reset handler
  ```

### ✅ Next.js Security Patch (5 min)
- [x] Upgrade Next.js in `apps/web/package.json` from 14.2.35 to latest LTS
  ```bash
  npm --prefix apps/web install next@latest
  npm run verify  # Should pass
  ```

### ✅ Session Isolation (1 hr)
- [x] Clone demo state per session in `apps/api/src/routes/auth.ts` login handler
  - Instead of global `state`, create per-user maps in sessionStore
  
- [x] Update `sessionStore.ts` to map token → demoState
  ```typescript
  const sessionStates = new Map<string, DemoState>();  // Add this
  ```

### ✅ Basic Test Suite (1 hr)
Add to `apps/api/src/scripts/contractSmoke.ts` or new test file:
- [x] Test: Invalid PIN → 401
- [x] Test: Missing token → 401
- [x] Test: Invalid subscription ID → 404
- [x] Test: Concurrent state mutations don't leak

### ✅ UX Fix (5 min)
- [x] Remove `View Dashboard Preview` link from `apps/web/app/page.tsx` line 23
  Or replace with static mockup that doesn't require auth

---

## Nice-to-Have (If Time Permits)

### Persistence (1.5 hrs - Lower Priority)
- [x] Validate Prisma schema/tooling and relation correctness (`prisma validate` passes with env)
- [x] Keep demo runtime intentionally in-memory with per-user isolation (design choice for deterministic judge demo)
- [x] Retain DB schema as deployment-ready model without forcing runtime DB dependency in demo mode

### Additional Tests (30 min - Lower Priority)
- [x] Test cancellation state transitions
- [x] Test block rule creation/update
- [x] Test dispute record creation

---

## Verification Commands

After each fix, run:
```bash
npm run verify          # Must pass (typecheck + contracts + lint + build)
npm run qa:contracts   # All 14 assertions must pass
```

---

## Team Responsibility

**Pranjal:** ALL items above (items 1-5 are in your scope)  
**Other Team Members:** Deployment, frontend enhancements, marketing materials (not yet started)

---

## Win Probability Progression

| Stage | Probability | What Changed |
|-------|-----------|--------------|
| Current (Apr 6) | 20-30% | None; multiple HIGH findings unfixed |
| After Auth + Tests | 35-45% | Security & visibility improved |
| After Isolation | 45-55% | Demo stability for concurrent judges |
| After All Fixes | 50-65% | Competitive with top 20% of hackathons |

---

**Target:** Complete ALL critical fixes before submission (Apr 11)  
**Estimated Time:** 3-4 hours of focused work  
**Difficulty:** Easy-to-Medium (no architectural rewrites needed)
