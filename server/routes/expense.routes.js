const { Router } = require('express');
const { createExpense, getMyExpenses, getExpenseById, getAllExpenses } = require('../controllers/expense.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.get('/all', authorize('ADMIN', 'MANAGER'), getAllExpenses);
router.post('/', createExpense);
router.get('/my', getMyExpenses);
router.get('/:id', getExpenseById);

module.exports = router;
