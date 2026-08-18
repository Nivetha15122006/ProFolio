const { handleApiRequest } = require('../server/routes/api');
const { initStorage } = require('../server/services/storageService');
const url = require('url');

let initialized = false;

module.exports = async (req, res) => {
  if (!initialized) {
    try {
      await initStorage();
      initialized = true;
    } catch (err) {
      console.error("[Vercel initStorage error]:", err);
    }
  }

  // Set standard CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  req.pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;

  return new Promise((resolve) => {
    // If Vercel pre-parsed the request body buffer
    if (req.body) {
      const bodyBuffer = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
      
      handleApiRequest(req, res, bodyBuffer)
        .then(() => resolve())
        .catch(err => {
          console.error("[Vercel API Callback error]:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Internal Server Error", details: err.message }));
          resolve();
        });
      return;
    }

    // Fallback: Read chunks if stream is still active
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      const bodyBuffer = Buffer.concat(chunks);
      try {
        await handleApiRequest(req, res, bodyBuffer);
        resolve();
      } catch (err) {
        console.error("[Vercel Serverless Function Error]:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal Server Error", details: err.message }));
        resolve();
      }
    });

    req.on('error', (err) => {
      console.error("[Vercel Request Stream Error]:", err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Bad Request" }));
      resolve();
    });
  });
};
