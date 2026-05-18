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

echo "Generating Prisma client and syncing schema..."
npx prisma generate
if [ -d prisma/migrations ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate deploy
else
  npx prisma db push --accept-data-loss
fi

echo "Building backend..."
npm run build

echo "Restarting API service..."
systemctl restart indusfortb2b-api

echo "Reloading nginx..."
nginx -t && systemctl reload nginx

echo "Deployment complete!"