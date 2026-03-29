const { Router } = require('express');
const { createRule, getRules } = require('../controllers/rule.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.post('/', authorize('ADMIN'), createRule);
router.get('/', authorize('ADMIN', 'MANAGER'), getRules);

module.exports = router;
