const ruleService = require('../services/rule.service');
const { sendSuccess } = require('../utils/response');

const createRule = async (req, res) => {
  const rule = await ruleService.createRule(req.body, req.user);
  sendSuccess(res, 'Approval rule created successfully.', rule, 201);
};

const getRules = async (req, res) => {
  const rules = await ruleService.getRules(req.user.companyId);
  sendSuccess(res, 'Approval rules retrieved successfully.', rules);
};

module.exports = { createRule, getRules };
