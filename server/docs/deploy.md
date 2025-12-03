# Deployment Guide

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed.

### Running Locally (Dev Mode)
1. Ensure `.env` is configured (set `MONGO_URI=mongodb://mongo:27017/hkglug`).
2. Run:
   ```bash
   npm run docker:up
   ```
   This starts the API on port 4000 and MongoDB on port 27017.
   Source code is mounted for hot reloading.

### Production Build
1. Build the image:
   ```bash
   npm run docker:build
   ```
2. Run with production configuration (ensure `NODE_ENV=production` in `.env` or environment).

### Commands
- **Start**: `npm run docker:up`
- **Stop**: `npm run docker:down`
- **Logs**: `docker-compose logs -f`
