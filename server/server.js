const http = require('http');
const { handleApiRequest } = require('./routes/api');
const { initStorage } = require('./services/storageService');

const PORT = 5000;

// Initialize database files
initStorage().then(() => {
  console.log("[Storage] Seeded files initialized.");
});

// Native Node.js HTTP Server
const server = http.createServer((req, res) => {
  const chunks = [];
  
  // Reading incoming stream into buffers
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });
  
  req.on('end', async () => {
    const bodyBuffer = Buffer.concat(chunks);
    
    // Delegate request handling to our routes
    try {
      await handleApiRequest(req, res, bodyBuffer);
    } catch (err) {
      console.error("[HTTP server callback exception]:", err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
  
  req.on('error', (err) => {
    console.error("[HTTP request stream error]:", err);
    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: "Bad Request" }));
  });
});

server.listen(PORT, () => {
  console.log(`[Native Node.js Server] Ready and listening on http://localhost:${PORT}`);
});
