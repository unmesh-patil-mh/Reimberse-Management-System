const expenseService = require('../services/expense.service');
const { sendSuccess } = require('../utils/response');

const getAllExpenses = async (req, res) => {
  const expenses = await expenseService.getAllExpenses(req.user.companyId);
  sendSuccess(res, 'All expenses retrieved successfully.', expenses);
};

const createExpense = async (req, res) => {
  const expense = await expenseService.createExpense(req.body, req.user);
  sendSuccess(res, 'Expense created with dynamic approval chain.', expense, 201);
};

const getMyExpenses = async (req, res) => {
  const expenses = await expenseService.getMyExpenses(req.user.id);
  sendSuccess(res, 'Your expenses retrieved successfully.', expenses);
};

const getExpenseById = async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id, req.user);
  sendSuccess(res, 'Expense retrieved successfully.', expense);
};

module.exports = { createExpense, getMyExpenses, getExpenseById, getAllExpenses };
