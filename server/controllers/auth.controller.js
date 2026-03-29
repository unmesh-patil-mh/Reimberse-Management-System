const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

const signup = async (req, res) => {
  const result = await authService.signup(req.body);
  sendSuccess(res, 'Account created successfully.', result, 201);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, 'Login successful.', result);
};

module.exports = { signup, login };
