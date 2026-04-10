FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/api/package*.json ./
RUN npm ci

COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD node -e "fetch('http://127.0.0.1:4000/health').then((res)=>{if(!res.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
