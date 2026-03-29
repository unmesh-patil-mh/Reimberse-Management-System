const { Router } = require('express');
const { createCompany, getCompany } = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', createCompany);
router.get('/', authenticate, authorize('ADMIN'), getCompany);

module.exports = router;
