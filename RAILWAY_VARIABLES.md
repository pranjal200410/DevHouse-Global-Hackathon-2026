# Railway Environment Variables - Simple Setup List

## API Service Variables
Copy and paste each into Railway API Service → Variables tab:

```
DATABASE_URL=postgresql://user:password@host:5432/railway
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://subguard.up.railway.app
DEMO_RESET_KEY=devhouse-reset-2026
```

---

## Web Service Variables
Copy and paste each into Railway Web Service → Variables tab:

```
NODE_ENV=production
PORT=3000
API_PROXY_TARGET=https://your-api-domain.up.railway.app
NEXT_TELEMETRY_DISABLED=1
```

---

## How to Add on Railway

1. **For API Service:**
   - Open Railway Dashboard
   - Click API service
   - Click "Variables" tab
   - For each variable above:
     - Click "New Variable"
     - Enter key (e.g., `DATABASE_URL`)
     - Enter value
     - Save
   - Click "Deploy" button

2. **For Web Service:**
   - Open Railway Dashboard
   - Click Web service (subguard.up.railway.app)
   - Click "Variables" tab
   - For each variable above:
     - Click "New Variable"
     - Enter key (e.g., `NODE_ENV`)
     - Enter value
     - Save
   - Click "Deploy" button

---

## Important Notes

- **DATABASE_URL**: Get from PostgreSQL service Variables tab
- **CORS_ORIGIN**: Set to your Web domain (e.g., `https://subguard.up.railway.app`)
- **API_PROXY_TARGET**: Set to your API domain after API is deployed
- **DEMO_RESET_KEY**: Keep as `devhouse-reset-2026` (for testing only)

---

## Quick Reference

| Variable | API | Web | Example Value |
|----------|-----|-----|----------------|
| DATABASE_URL | ✅ | ❌ | postgresql://... |
| NODE_ENV | ✅ | ✅ | production |
| PORT | ✅ | ✅ | 4000 / 3000 |
| HOST | ✅ | ❌ | 0.0.0.0 |
| CORS_ORIGIN | ✅ | ❌ | https://subguard.up.railway.app |
| DEMO_RESET_KEY | ✅ | ❌ | devhouse-reset-2026 |
| API_PROXY_TARGET | ❌ | ✅ | https://api-domain.up.railway.app |
| NEXT_TELEMETRY_DISABLED | ❌ | ✅ | 1 |
