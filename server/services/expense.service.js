const prisma = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Dynamically builds the manager approval chain by walking up the managerId hierarchy.
 * Returns an ordered array of approver user IDs.
 * NO hardcoded chains — purely DB-driven.
 */
const buildManagerChain = async (userId) => {
  const chain = [];
  let currentId = userId;
  const visited = new Set();

  while (currentId) {
    const user = await prisma.user.findUnique({
      where: { id: currentId },
      select: { managerId: true },
    });

    if (!user || !user.managerId) break;

    // Prevent infinite loops in case of circular references
    if (visited.has(user.managerId)) break;
    visited.add(user.managerId);

    chain.push(user.managerId);
    currentId = user.managerId;
  }

  return chain;
};

const createExpense = async (data, user) => {
  const { amount, currency, category, description, date } = data;

  // Fetch approval rules for this company from DB
  const rules = await prisma.approvalRule.findMany({
    where: { companyId: user.companyId },
    include: { specificApprover: { select: { id: true, name: true } } },
  });

  // Build dynamic manager chain
  const managerChain = await buildManagerChain(user.id);

  // Build the list of approvers dynamically from rules + manager chain
  const approverIds = [];

  // Always include the manager hierarchy
  for (const managerId of managerChain) {
    if (!approverIds.includes(managerId)) {
      approverIds.push(managerId);
    }
  }

  // If rules specify a specific approver, include them in the chain
  for (const rule of rules) {
    if (
      (rule.type === 'SPECIFIC' || rule.type === 'HYBRID') &&
      rule.specificApproverId &&
      !approverIds.includes(rule.specificApproverId)
    ) {
      approverIds.push(rule.specificApproverId);
    }
  }

  if (approverIds.length === 0) {
    throw new AppError(
      'No approval chain could be built. Ensure managers are assigned and approval rules exist.',
      400
    );
  }

  // Create expense and approval steps in a single transaction
  const expense = await prisma.$transaction(async (tx) => {
    const newExpense = await tx.expense.create({
      data: {
        amount,
        currency: currency || 'INR',
        category,
        description: description || null,
        date: new Date(date),
        status: 'PENDING',
        currentStepOrder: 1,
        createdById: user.id,
      },
    });

    // Create approval steps dynamically — ordered by sequence
    const stepData = approverIds.map((approverId, index) => ({
      expenseId: newExpense.id,
      approverId,
      sequenceOrder: index + 1,
      status: 'PENDING',
    }));

    await tx.approvalStep.createMany({ data: stepData });

    return newExpense;
  });

  // Return with full details
  const result = await prisma.expense.findUnique({
    where: { id: expense.id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      approvalSteps: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { sequenceOrder: 'asc' },
      },
    },
  });

  return result;
};

const getMyExpenses = async (userId) => {
  const expenses = await prisma.expense.findMany({
    where: { createdById: userId },
    include: {
      approvalSteps: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { sequenceOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return expenses;
};

const getExpenseById = async (id, user) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, companyId: true } },
      approvalSteps: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { sequenceOrder: 'asc' },
      },
    },
  });

  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  // Company isolation — only users from the same company can view
  if (expense.createdBy.companyId !== user.companyId) {
    throw new AppError('Access denied. Expense belongs to another company.', 403);
  }

  return expense;
};

module.exports = { createExpense, getMyExpenses, getExpenseById };
