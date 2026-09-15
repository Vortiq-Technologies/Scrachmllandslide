const morgan = require('morgan');
const env = require('../config/env');

// Custom tokens or formats
const requestLogger = () => {
  if (env.NODE_ENV === 'test') {
    // Return dummy middleware in test mode to keep test output clean
    return (req, res, next) => next();
  }

  if (env.NODE_ENV === 'production') {
    // Combined format for production
    return morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms');
  }

  // Development-friendly clean format
  return morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);

    return `[HTTP] ${method} ${url} ${status} - ${responseTime} ms`;
  });
};

module.exports = requestLogger;
