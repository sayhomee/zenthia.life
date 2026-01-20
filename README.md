# Zenthia.life

A botanical tea product catalog built with React + Vite.

## Project Structure

```
zenthia.life/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── front-end/              # Vite React application
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server.js               # Production server (serves built files)
├── start_zenthia.sh        # PM2 startup script
└── README.md
```

## Development

```bash
cd front-end
npm install
npm run dev
```

The development server runs on http://localhost:5173

## Deployment

### Automatic (GitHub Actions)

When changes are merged to `main`:
1. GitHub Actions builds the Vite app
2. Deploys the built files to DigitalOcean droplet via SCP
3. Restarts PM2

### GitHub Secrets Required

Set these in your repo Settings → Secrets → Actions:

| Secret | Description |
|--------|-------------|
| `DO_HOST` | Your droplet IP address |
| `DO_USERNAME` | SSH username (e.g., `root`) |
| `DO_SSH_KEY` | Private SSH key for authentication |
| `DO_DEPLOY_PATH` | Deployment path (e.g., `/var/www/zenthia.life`) |

### Manual Deployment

```bash
# Build locally
cd front-end
npm install
npm run build

# Copy to server
scp -r front-end/dist server.js start_zenthia.sh user@server:/path/to/zenthia.life/

# On server
pm2 restart zenthia
```

## Port

The production server runs on port **5446**.
