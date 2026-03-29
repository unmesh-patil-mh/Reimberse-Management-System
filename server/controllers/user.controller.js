const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body, req.user);
  sendSuccess(res, 'User created successfully.', user, 201);
};

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers(req.user.companyId);
  sendSuccess(res, 'Users retrieved successfully.', users);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);
  sendSuccess(res, 'User updated successfully.', user);
};

module.exports = { createUser, getAllUsers, updateUser };
