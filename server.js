const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5446;

// Directory where Vite builds the app
const DIST_DIR = path.join(__dirname, 'front-end', 'dist');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    // Parse the URL and get the pathname
    let urlPath = req.url.split('?')[0]; // Remove query params for file resolution
    
    // Default to index.html for root path
    if (urlPath === '/') {
        urlPath = '/index.html';
    }
    
    // Construct the file path
    let filePath = path.join(DIST_DIR, urlPath);
    
    // Get the file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found - serve index.html for SPA routing
            filePath = path.join(DIST_DIR, 'index.html');
        }
        
        // Read and serve the file
        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500);
                res.end(`Server Error: ${readErr.code}`);
                return;
            }
            
            // Determine content type
            const fileExt = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';
            
            // Set cache headers for assets (JS, CSS, images)
            const headers = { 'Content-Type': contentType };
            if (fileExt !== '.html') {
                // Cache static assets for 1 year (they have hashed filenames)
                headers['Cache-Control'] = 'public, max-age=31536000, immutable';
            } else {
                // Don't cache HTML
                headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            }
            
            res.writeHead(200, headers);
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`🍃 Zenthia.life server running on port ${PORT}`);
    console.log(`   Serving files from: ${DIST_DIR}`);
});
