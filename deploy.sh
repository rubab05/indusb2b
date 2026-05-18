#!/bin/bash
set -e

cd /var/www/indusfortb2b

BRANCH="${BRANCH:-b2b-rf}"
API_URL="${VITE_API_URL:-https://b2b.indusfort.co.uk/api}"

echo "Pulling latest code from $BRANCH..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "Installing frontend dependencies..."
npm install

echo "Building frontend with API URL: $API_URL"
VITE_API_URL="$API_URL" npm run build

echo "Installing backend dependencies..."
cd server
npm install

echo "Generating Prisma client and applying migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Building backend..."
npm run build

echo "Restarting API service..."
systemctl restart indusfortb2b-api

echo "Reloading nginx..."
nginx -t && systemctl reload nginx

echo "Deployment complete!"