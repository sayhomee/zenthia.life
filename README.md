# Zenthia.life

A botanical tea product catalog built with React + Vite.

## Project Structure

```
zenthia.life/
├── front-end/          # Vite React application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── dist/           # Built files (generated)
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
├── server.js           # Production server (serves built files)
├── start_zenthia.sh    # Deployment script (used by PM2)
└── README.md
```

## Development

```bash
cd front-end
npm install
npm run dev
```

The development server runs on http://localhost:5173

## Production Deployment

The `start_zenthia.sh` script handles the full deployment:

1. Installs dependencies (if needed)
2. Builds the Vite app
3. Starts the Node.js server on port 5446

### Manual deployment:

```bash
# Build the app
cd front-end
npm install
npm run build
cd ..

# Start the server
node server.js
```

### PM2 deployment:

```bash
pm2 start start_zenthia.sh --name zenthia
```

## Auto-Deploy on DigitalOcean

When changes are merged to `main`, pull and restart on your droplet:

```bash
cd /path/to/zenthia.life
git pull origin main
pm2 restart zenthia
```

Or set up a webhook/cron for automatic updates.

## Port

The production server runs on port **5446**.
