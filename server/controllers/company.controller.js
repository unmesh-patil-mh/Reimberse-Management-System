const companyService = require('../services/company.service');
const { sendSuccess } = require('../utils/response');

const createCompany = async (req, res) => {
  const company = await companyService.createCompany(req.body);
  sendSuccess(res, 'Company created successfully.', company, 201);
};

const getCompany = async (req, res) => {
  const company = await companyService.getCompany(req.user.companyId);
  sendSuccess(res, 'Company retrieved successfully.', company);
};

module.exports = { createCompany, getCompany };
