const prisma = require('../config/db');
const { sendSuccess } = require('../utils/response');

const healthCheck = async (req, res) => {
  // Real DB ping — not a fake response
  await prisma.$queryRaw`SELECT 1`;
  sendSuccess(res, 'Server is healthy. Database connected.', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { healthCheck };
