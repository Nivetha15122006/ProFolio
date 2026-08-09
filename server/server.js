const http = require('http');
const { handleApiRequest } = require('./routes/api');
const { initStorage } = require('./services/storageService');

const PORT = 5000;

// Initialize database files
initStorage().then(() => {
  console.log("[Storage] Seeded files initialized.");
});

const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Native Node.js HTTP Server serving APIs and Static files
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname.startsWith('/api')) {
    const chunks = [];
    
    // Reading incoming stream into buffers for API requests
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    req.on('end', async () => {
      const bodyBuffer = Buffer.concat(chunks);
      try {
        await handleApiRequest(req, res, bodyBuffer);
      } catch (err) {
        console.error("[HTTP server API callback exception]:", err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    
    req.on('error', (err) => {
      console.error("[HTTP API request stream error]:", err);
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: "Bad Request" }));
    });
  } else {
    // Serve static frontend client assets using streams
    let filePath = path.join(__dirname, '../client/dist', pathname);
    
    // If it's a folder or does not have an extension, fall back to React Router's index.html
    if (pathname === '/' || !path.extname(filePath)) {
      filePath = path.join(__dirname, '../client/dist/index.html');
    }
    
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const indexHtmlPath = path.join(__dirname, '../client/dist/index.html');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexHtmlPath).pipe(res);
      } else {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`[Native Node.js Server] Ready and listening on http://localhost:${PORT}`);
});
