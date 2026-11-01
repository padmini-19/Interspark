const errorHandler = (err, req, res, next) => {
  // If the status code is 200, default to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    // Hide the error stack trace if running in production mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;