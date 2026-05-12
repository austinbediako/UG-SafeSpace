#!/bin/bash

# Render Entrypoint Script for SafeSpace UG Backend
# This script runs migrations and starts the server

set -e

echo "🚀 Starting SafeSpace UG Backend Deployment..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client (in case it wasn't generated during build)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Optional: Seed database (uncomment if you have seed data)
echo "🌱 Seeding database..."
npx prisma db seed

# Start the application
echo "✅ Starting server..."
exec npm start
