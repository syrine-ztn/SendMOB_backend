const fs = require('fs');
const path = require('path');

class LoggingService {
  constructor() {
    // Construct the path to the log file
    this.logFilePath = path.join(__dirname, '../../..', 'logs', 'logFile.log');
  }

  async log(message) {
    try {
      const logMessage = `${new Date().toISOString()} - ${message}\n`;
      await fs.promises.appendFile(this.logFilePath, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
}

module.exports = LoggingService;
