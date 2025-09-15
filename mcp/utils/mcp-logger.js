const fs = require('fs');
const path = require('path');

class MCPLogger {
  constructor(config = {}) {
    this.config = {
      level: config.level || 'info',
      file: config.file || path.join(process.cwd(), 'logs', 'mcp.log'),
      console: config.console !== false,
      timestamp: config.timestamp !== false,
      ...config
    };

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this.colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[37m', // White
      success: '\x1b[32m', // Green
      reset: '\x1b[0m'
    };

    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.config.file);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.config.level];
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.config.timestamp ? new Date().toISOString() : '';
    const prefix = timestamp ? `[${timestamp}] ` : '';
    const levelStr = level.toUpperCase().padEnd(5);
    
    let formattedMessage = `${prefix}${levelStr} ${message}`;
    
    if (data) {
      if (typeof data === 'object') {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      } else {
        formattedMessage += ` ${data}`;
      }
    }
    
    return formattedMessage;
  }

  writeToFile(message) {
    if (this.config.file) {
      try {
        fs.appendFileSync(this.config.file, message + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error.message);
      }
    }
  }

  writeToConsole(level, message) {
    if (this.config.console) {
      const color = this.colors[level] || this.colors.reset;
      console.log(`${color}${message}${this.colors.reset}`);
    }
  }

  log(level, message, data = null) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    this.writeToFile(formattedMessage);
    this.writeToConsole(level, formattedMessage);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  debug(message, data = null) {
    this.log('debug', message, data);
  }

  success(message, data = null) {
    if (this.config.console) {
      const formattedMessage = this.formatMessage('info', message, data);
      this.writeToConsole('success', formattedMessage);
    }
    this.log('info', `✅ ${message}`, data);
  }

  // Specialized logging methods for MCP operations
  logTestStart(testFile, config = {}) {
    this.info(`🚀 Starting test: ${testFile}`, config);
  }

  logTestComplete(testFile, duration, result) {
    const status = result.success ? '✅' : '❌';
    this.info(`${status} Test completed: ${testFile}`, {
      duration: `${duration}ms`,
      success: result.success,
      errors: result.errors || 0
    });
  }

  logAIAnalysis(testFile, analysisType, result) {
    this.info(`🤖 AI Analysis completed: ${testFile}`, {
      type: analysisType,
      success: result.success,
      insights: result.insights?.length || 0
    });
  }

  logDataGeneration(type, count, format, success) {
    const status = success ? '✅' : '❌';
    this.info(`${status} Data generation: ${type}`, {
      count,
      format,
      success
    });
  }

  logServerStart(serverName, port) {
    this.success(`🚀 MCP Server started: ${serverName}`, { port });
  }

  logServerStop(serverName) {
    this.info(`🛑 MCP Server stopped: ${serverName}`);
  }

  logError(operation, error) {
    this.error(`❌ ${operation} failed`, {
      message: error.message,
      stack: error.stack
    });
  }

  // Performance logging
  startTimer(operation) {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        this.debug(`⏱️ ${operation} took ${duration}ms`);
        return duration;
      }
    };
  }

  // Clear log file
  clearLog() {
    if (this.config.file && fs.existsSync(this.config.file)) {
      fs.writeFileSync(this.config.file, '');
      this.info('📝 Log file cleared');
    }
  }

  // Get recent log entries
  getRecentLogs(lines = 50) {
    if (!this.config.file || !fs.existsSync(this.config.file)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.config.file, 'utf8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines.slice(-lines);
    } catch (error) {
      this.error('Failed to read log file', error);
      return [];
    }
  }
}

module.exports = MCPLogger;
