const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class DevPortfolioEmitter extends EventEmitter {}

const eventEmitter = new DevPortfolioEmitter();
const LOG_DIR = path.join(__dirname, '../logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Open a write stream for the audit log
const logStream = fs.createWriteStream(path.join(LOG_DIR, 'audit.log'), { flags: 'a', encoding: 'utf8' });

function logToFile(eventName, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: eventName,
    data: data
  };
  
  // Write message using stream
  logStream.write(JSON.stringify(logEntry) + '\n');
  console.log(`[Event Logger] Logged event: ${eventName}`);
}

// Setup Event Listeners
eventEmitter.on('projectCreated', (data) => {
  logToFile('projectCreated', data);
});

eventEmitter.on('resumeAnalyzed', (data) => {
  logToFile('resumeAnalyzed', data);
});

eventEmitter.on('portfolioUpdated', (data) => {
  logToFile('portfolioUpdated', data);
});

module.exports = eventEmitter;
