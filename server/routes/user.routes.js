const { Router } = require('express');
const { createUser, getAllUsers, updateUser } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate);

router.post('/', authorize('ADMIN'), createUser);
router.get('/', authorize('ADMIN', 'MANAGER'), getAllUsers);
router.patch('/:id', authorize('ADMIN'), updateUser);

module.exports = router;
