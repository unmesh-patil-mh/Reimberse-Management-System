const { Router } = require('express');
const { createCompany, getCompany } = require('../controllers/company.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', createCompany);
router.get('/', authenticate, getCompany);

module.exports = router;
