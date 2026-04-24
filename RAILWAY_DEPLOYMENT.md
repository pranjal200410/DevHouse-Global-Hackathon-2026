# Railway Deployment Guide - Subscription Guard

## Overview
This guide covers deploying Subscription Guard on Railway with separate API and Web services connected to a PostgreSQL database.

## Prerequisites
- Railway account at https://railway.app
- GitHub repository pushed and accessible
- Docker configured for your local testing

## Architecture
```
PostgreSQL (Railway) 
    ↓
API Service (Node.js/Fastify on port 4000)
    ↓
Web Service (Next.js on port 3000) → User Browser
```

---

## Step 1: Create PostgreSQL Database

1. Log into Railway dashboard
2. Create new project → Select "Provision PostgreSQL"
3. Once created, open the PostgreSQL service
4. Copy the `DATABASE_URL` from the Variables tab
5. Format: `postgresql://user:password@host:port/railway`

---

## Step 2: Deploy API Service

### Configure Railway Build
1. Create new service from GitHub (select DevHouse-Global-Hackathon-2026)
2. In deployment settings:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `docker/api.Dockerfile`
   - **Build Context**: Project root

### Set Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | From PostgreSQL service |
| `NODE_ENV` | `production` | Required for prod optimization |
| `PORT` | `4000` | Internal port (Railway handles external) |
| `HOST` | `0.0.0.0` | Bind to all interfaces |
| `CORS_ORIGIN` | `https://web-prod.up.railway.app` | Update after Web deploy |
| `DEMO_RESET_KEY` | `devhouse-reset-2026` | For testing/reset endpoints |

### Deploy
1. Save and deploy
2. Railway will build and deploy automatically
3. Once live, note the domain: `api-prod.up.railway.app` (example)
4. Health check runs on `/health` endpoint

### Run Database Migrations
After API deployment, run Prisma migrations:

```bash
# Via Railway CLI (install from https://docs.railway.app/cli/install)
railway shell

cd /app
npx prisma migrate deploy --skip-generate
```

Or manually via SSH/exec into API container.

---

## Step 3: Deploy Web Service

### Configure Railway Build
1. Create new service from same GitHub repo
2. In deployment settings:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `docker/web.Dockerfile`
   - **Build Context**: Project root

### Set Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required for prod optimization |
| `PORT` | `3000` | Internal port (Railway handles external) |
| `API_PROXY_TARGET` | `https://api-prod.up.railway.app` | From Step 2 API domain |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disable Next.js telemetry |

### Deploy
1. Save and deploy
2. Once live, note the domain: `web-prod.up.railway.app` (example)
3. Health check runs on `/` endpoint

---

## Step 4: Update CORS in API

After Web deployment completes:

1. Go back to API service
2. Update `CORS_ORIGIN` variable to match Web domain: `https://web-prod.up.railway.app`
3. Redeploy API service

---

## Verification Checklist

- [ ] PostgreSQL service running and accessible
- [ ] API service deployed and health `/health` returns 200
- [ ] Web service deployed and home `/` returns 200
- [ ] Database migrations completed successfully
- [ ] CORS configured with correct Web domain
- [ ] Login page accessible and demo auth works
- [ ] API proxy in Web correctly routes to API
- [ ] Demo data loads in dashboard

---

## Common Issues & Solutions

### **Database Connection Failed**
- Verify `DATABASE_URL` is correct and accessible
- Check PostgreSQL service is running
- Ensure firewall rules allow connection

### **CORS Errors**
- Verify `CORS_ORIGIN` matches exact Web domain (include https://)
- Restart API service after environment variable change
- Check browser console for actual origin being requested

### **API Proxy Returning 503**
- Verify `API_PROXY_TARGET` points to correct API domain
- Check API service is running (`/health` endpoint)
- Ensure both services can communicate (same project)

### **Next.js Build Failures**
- Check Node version (requires 20+)
- Verify all TypeScript types compile locally first
- Check `next.config.mjs` for any build-time issues

### **Prisma Client Out of Sync**
- Regenerate client: `npx prisma generate`
- Clear `.next` build cache
- Redeploy Web service

---

## Environment Variables Cheat Sheet

### API Service
```
DATABASE_URL=postgresql://user:pass@host:5432/railway
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://web-prod.up.railway.app
DEMO_RESET_KEY=devhouse-reset-2026
```

### Web Service
```
NODE_ENV=production
PORT=3000
API_PROXY_TARGET=https://api-prod.up.railway.app
NEXT_TELEMETRY_DISABLED=1
```

---

## Monitoring

From Railway dashboard:
- **Logs**: View real-time service logs
- **Metrics**: Monitor CPU, memory, network
- **Deployments**: Track all service versions
- **Health Checks**: See endpoint status

---

## Rollback

To rollback to previous deployment:
1. Select service
2. Click "Deployments" tab
3. Select previous deployment version
4. Click "Redeploy"

---

## Scaling

From service settings:
- **Replicas**: Increase for load balancing
- **CPU/Memory**: Adjust resource limits
- **Auto-scaling**: Enable for production

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Fastify Deployment: https://www.fastify.io/docs/latest/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Migration: https://www.prisma.io/docs/orm/prisma-migrate

---

**Last Updated**: April 24, 2026
**Author**: DevHouse Team
