const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const createCompany = async (data) => {
  const { name, baseCurrency } = data;

  const company = await prisma.company.create({
    data: {
      name,
      baseCurrency: baseCurrency || 'INR',
    },
  });

  return company;
};

const getCompany = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: { select: { users: true, approvalRules: true } },
    },
  });

  if (!company) {
    throw new AppError('Company not found.', 404);
  }

  return company;
};

module.exports = { createCompany, getCompany };
