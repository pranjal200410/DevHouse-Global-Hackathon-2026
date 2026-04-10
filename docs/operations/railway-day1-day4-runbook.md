# Vishwas Day 1-4 Deployment Runbook

This runbook covers Vishwas ownership for deployment stability, health checks, and rollback readiness.

## Day 1: Foundation Setup

1. Create Railway project and environment variables.
2. Commit Docker assets:
   - `docker/api.Dockerfile`
   - `docker/web.Dockerfile`
   - `docker/docker-compose.yml`
   - `railway.json`
3. Enable CI workflow (`.github/workflows/ci.yml`).
4. Configure production secrets in GitHub:
   - `RAILWAY_TOKEN`
   - `RAILWAY_PROJECT_ID`
   - `RAILWAY_SERVICE_ID`
   - `RAILWAY_PUBLIC_API_URL` (optional, for post-deploy health checks).

## Day 2: E2E + Pipeline Integration

1. Install Playwright browsers:
   - `npm --prefix apps/web run e2e:install`
2. Validate end-to-end journey:
   - `npm run qa:e2e`
3. Trigger CI and confirm:
   - verify job passes (`npm run verify` + API tests)
   - docker build smoke passes

## Day 3: Stability Monitoring

1. Verify API uptime endpoint:
   - `curl http://localhost:4000/health`
2. Verify container health checks:
   - `npm run docker:up`
   - `docker ps` (both services should be healthy)
3. Verify alerting behavior through screen 13 (`/alerts`) and protection controls (`/protection`).

## Day 4: Rollback Drills

1. Ensure previous deploy artifact is available in Railway dashboard.
2. Perform rollback simulation:
   - Deploy current main.
   - Trigger rollback to previous healthy deployment.
3. Validate health after rollback:
   - `curl $RAILWAY_PUBLIC_API_URL/health`
4. Confirm target recovery time under 5 minutes.

## Daily Operational Checklist

1. CI green on latest main branch.
2. API `/health` returns `status: ok`.
3. Demo login, dashboard, cancellations, protection, and alerts all load.
4. At least one successful rollback point exists in Railway history.

## Incident Response

1. Detect issue via CI failure or health-check degradation.
2. Roll back to last known stable deployment in Railway.
3. Run smoke checks:
   - `/health`
   - `/v1/auth/demo-login`
   - `/v1/dashboard/summary`
4. Re-run `npm run verify` on fix branch.
5. Re-deploy after green checks.
