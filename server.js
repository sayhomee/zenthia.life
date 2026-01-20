const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5446;

const server = http.createServer((req, res) => {
    // Determine the file path
    let filePath = path.join(__dirname, 'index.html');

    // Read the index.html file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                // Page not found
                res.writeHead(404);
                res.end('Error: index.html not found in this directory.');
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success: Serve the file
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
