const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const prisma = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please provide a valid token.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, companyId: true, managerId: true },
    });

    if (!user) {
      throw new AppError('User not found. Token may be invalid.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired token.', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
