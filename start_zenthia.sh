#!/bin/bash

# Zenthia.life Deployment Script
# This script builds the Vite React app and starts the server

echo "🍃 Starting Zenthia.life deployment..."

# Navigate to the front-end directory
cd front-end

# Install dependencies if node_modules doesn't exist or package.json changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the Vite app
echo "🔨 Building the application..."
npm run build

# Go back to root
cd ..

# Start the server
echo "🚀 Starting the server..."
node server.js
