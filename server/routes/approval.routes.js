const { Router } = require('express');
const {
  getPendingApprovals,
  approveExpense,
  rejectExpense,
} = require('../controllers/approval.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.get('/pending', authorize('ADMIN', 'MANAGER'), getPendingApprovals);
router.post('/:expenseId/approve', authorize('ADMIN', 'MANAGER'), approveExpense);
router.post('/:expenseId/reject', authorize('ADMIN', 'MANAGER'), rejectExpense);

module.exports = router;
