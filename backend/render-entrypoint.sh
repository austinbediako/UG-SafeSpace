#!/bin/bash

# Render Entrypoint Script for SafeSpace UG Backend
# This script runs migrations and starts the server

set -e

echo "🚀 Starting SafeSpace UG Backend Deployment..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Check and run database migrations only if needed
echo "📦 Checking database migration status..."
if npx prisma migrate status | grep -q "Database schema is up to date"; then
  echo "✅ Database schema is up to date, skipping migrations."
else
  echo "📦 Running database migrations..."
  npx prisma migrate deploy
fi

# Generate Prisma Client (in case it wasn't generated during build)
# echo "🔧 Generating Prisma Client..."
# npx prisma generate

# Optional: Seed database (uncomment if you have seed data)
# echo "🌱 Seeding database..."
# npx prisma db seed

# Start the application
echo "✅ Starting server..."
exec npm start
