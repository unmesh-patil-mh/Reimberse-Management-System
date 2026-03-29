const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const createRule = async (data, adminUser) => {
  const { type, percentageValue, specificApproverId } = data;

  // Validate rule type requirements
  if (type === 'PERCENTAGE' && (percentageValue === null || percentageValue === undefined)) {
    throw new AppError('PERCENTAGE rule requires a percentageValue (0-100).', 400);
  }

  if (type === 'SPECIFIC' && !specificApproverId) {
    throw new AppError('SPECIFIC rule requires a specificApproverId.', 400);
  }

  if (type === 'HYBRID') {
    if (!percentageValue && !specificApproverId) {
      throw new AppError('HYBRID rule requires at least percentageValue or specificApproverId.', 400);
    }
  }

  // Validate specific approver belongs to same company
  if (specificApproverId) {
    const approver = await prisma.user.findUnique({ where: { id: specificApproverId } });
    if (!approver || approver.companyId !== adminUser.companyId) {
      throw new AppError('Specific approver not found in your company.', 404);
    }
  }

  const rule = await prisma.approvalRule.create({
    data: {
      companyId: adminUser.companyId,
      type,
      percentageValue: percentageValue || null,
      specificApproverId: specificApproverId || null,
    },
    include: {
      specificApprover: { select: { id: true, name: true, email: true } },
    },
  });

  return rule;
};

const getRules = async (companyId) => {
  const rules = await prisma.approvalRule.findMany({
    where: { companyId },
    include: {
      specificApprover: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rules;
};

module.exports = { createRule, getRules };
