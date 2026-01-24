#!/bin/bash

# Zenthia.life Server Script
# The app is pre-built by GitHub Actions, just start the server

echo "🍃 Zenthia.life Server"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting server..."
node server.js
