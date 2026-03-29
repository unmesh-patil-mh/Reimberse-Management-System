const prisma = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Evaluates approval rules from DB to determine if the expense should be marked APPROVED.
 * Rules are ALWAYS fetched from the database — never hardcoded.
 *
 * PERCENTAGE: approvedCount / totalSteps >= threshold
 * SPECIFIC: a designated approver has approved
 * HYBRID: either PERCENTAGE or SPECIFIC condition passes
 */
const evaluateRules = async (expense, companyId) => {
  const rules = await prisma.approvalRule.findMany({
    where: { companyId },
  });

  const steps = await prisma.approvalStep.findMany({
    where: { expenseId: expense.id },
  });

  const totalSteps = steps.length;
  const approvedSteps = steps.filter((s) => s.status === 'APPROVED').length;

  // If no rules exist, fall back to sequential: all steps must be approved
  if (rules.length === 0) {
    return approvedSteps === totalSteps;
  }

  // Evaluate each rule — any passing rule triggers approval
  for (const rule of rules) {
    let passes = false;

    if (rule.type === 'PERCENTAGE') {
      const percentage = (approvedSteps / totalSteps) * 100;
      passes = percentage >= rule.percentageValue;
    }

    if (rule.type === 'SPECIFIC') {
      const specificStep = steps.find(
        (s) => s.approverId === rule.specificApproverId && s.status === 'APPROVED'
      );
      passes = !!specificStep;
    }

    if (rule.type === 'HYBRID') {
      let percentagePasses = false;
      let specificPasses = false;

      if (rule.percentageValue) {
        const percentage = (approvedSteps / totalSteps) * 100;
        percentagePasses = percentage >= rule.percentageValue;
      }

      if (rule.specificApproverId) {
        const specificStep = steps.find(
          (s) => s.approverId === rule.specificApproverId && s.status === 'APPROVED'
        );
        specificPasses = !!specificStep;
      }

      passes = percentagePasses || specificPasses;
    }

    if (passes) return true;
  }

  return false;
};

const getPendingApprovals = async (user) => {
  // Find all PENDING approval steps assigned to this user
  const steps = await prisma.approvalStep.findMany({
    where: {
      approverId: user.id,
      status: 'PENDING',
    },
    include: {
      expense: {
        include: {
          createdBy: { select: { id: true, name: true, email: true, companyId: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Filter: must be PENDING expense, correct step order, same company
  let activeSteps = steps.filter(
    (step) =>
      step.expense.status === 'PENDING' &&
      step.sequenceOrder === step.expense.currentStepOrder &&
      step.expense.createdBy.companyId === user.companyId
  );

  // If ADMIN, also fetch steps in their company they could act on
  // (e.g., when the admin IS the approver for expenses they created)
  if (user.role === 'ADMIN' && activeSteps.length === 0) {
    const allCompanyPendingSteps = await prisma.approvalStep.findMany({
      where: {
        status: 'PENDING',
        expense: {
          status: 'PENDING',
          createdBy: { companyId: user.companyId },
        },
      },
      include: {
        expense: {
          include: {
            createdBy: { select: { id: true, name: true, email: true, companyId: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    activeSteps = allCompanyPendingSteps.filter(
      (step) => step.sequenceOrder === step.expense.currentStepOrder
    );
  }

  return activeSteps;
};

const approveExpense = async (expenseId, user, comments) => {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { createdBy: { select: { companyId: true } } },
  });

  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  if (expense.status !== 'PENDING') {
    throw new AppError(`Expense is already ${expense.status}.`, 400);
  }

  // Company isolation
  if (expense.createdBy.companyId !== user.companyId) {
    throw new AppError('Access denied.', 403);
  }

  // Find the current active step — check if user is the assigned approver
  let currentStep = await prisma.approvalStep.findFirst({
    where: {
      expenseId,
      approverId: user.id,
      sequenceOrder: expense.currentStepOrder,
      status: 'PENDING',
    },
  });

  // If not the assigned approver but is ADMIN, allow them to act on the current step
  if (!currentStep && user.role === 'ADMIN') {
    currentStep = await prisma.approvalStep.findFirst({
      where: {
        expenseId,
        sequenceOrder: expense.currentStepOrder,
        status: 'PENDING',
      },
    });
  }

  if (!currentStep) {
    throw new AppError('You are not authorized to approve this expense.', 403);
  }

  // Approve the current step
  await prisma.approvalStep.update({
    where: { id: currentStep.id },
    data: {
      status: 'APPROVED',
      comments: comments || null,
    },
  });

  // Evaluate rules from DB after every approval
  const shouldApprove = await evaluateRules(expense, expense.createdBy.companyId);

  if (shouldApprove) {
    // Rules satisfied — mark expense as APPROVED
    await prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED' },
    });
  } else {
    // Move to next step
    await prisma.expense.update({
      where: { id: expenseId },
      data: { currentStepOrder: expense.currentStepOrder + 1 },
    });
  }

  // Return updated expense
  const updatedExpense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      approvalSteps: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { sequenceOrder: 'asc' },
      },
    },
  });

  return updatedExpense;
};

const rejectExpense = async (expenseId, user, comments) => {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { createdBy: { select: { companyId: true } } },
  });

  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  if (expense.status !== 'PENDING') {
    throw new AppError(`Expense is already ${expense.status}.`, 400);
  }

  // Company isolation
  if (expense.createdBy.companyId !== user.companyId) {
    throw new AppError('Access denied.', 403);
  }

  // Find the current active step
  let currentStep = await prisma.approvalStep.findFirst({
    where: {
      expenseId,
      approverId: user.id,
      sequenceOrder: expense.currentStepOrder,
      status: 'PENDING',
    },
  });

  // Admin override
  if (!currentStep && user.role === 'ADMIN') {
    currentStep = await prisma.approvalStep.findFirst({
      where: {
        expenseId,
        sequenceOrder: expense.currentStepOrder,
        status: 'PENDING',
      },
    });
  }

  if (!currentStep) {
    throw new AppError('You are not authorized to reject this expense.', 403);
  }

  // Reject step and expense — flow stops immediately
  await prisma.$transaction([
    prisma.approvalStep.update({
      where: { id: currentStep.id },
      data: {
        status: 'REJECTED',
        comments: comments || null,
      },
    }),
    prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'REJECTED' },
    }),
  ]);

  const updatedExpense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      approvalSteps: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { sequenceOrder: 'asc' },
      },
    },
  });

  return updatedExpense;
};

module.exports = { getPendingApprovals, approveExpense, rejectExpense };
