const { Router } = require('express');
const { createExpense, getMyExpenses, getExpenseById } = require('../controllers/expense.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.post('/', createExpense);
router.get('/my', getMyExpenses);
router.get('/:id', getExpenseById);

module.exports = router;
