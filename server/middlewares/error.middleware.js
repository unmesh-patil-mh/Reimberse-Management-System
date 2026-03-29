const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  // Prisma known errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
      data: null,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
      data: null,
    });
  }

  // Custom operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  // Unknown errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
    data: null,
  });
};

module.exports = errorHandler;
