const approvalService = require('../services/approval.service');
const { sendSuccess } = require('../utils/response');

const getPendingApprovals = async (req, res) => {
  const pending = await approvalService.getPendingApprovals(req.user);
  sendSuccess(res, 'Pending approvals retrieved successfully.', pending);
};

const approveExpense = async (req, res) => {
  const result = await approvalService.approveExpense(
    req.params.expenseId,
    req.user,
    req.body.comments
  );
  sendSuccess(res, 'Expense approved successfully.', result);
};

const rejectExpense = async (req, res) => {
  const result = await approvalService.rejectExpense(
    req.params.expenseId,
    req.user,
    req.body.comments
  );
  sendSuccess(res, 'Expense rejected.', result);
};

module.exports = { getPendingApprovals, approveExpense, rejectExpense };
