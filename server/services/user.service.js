const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const createUser = async (data, adminUser) => {
  const { name, email, password, role, managerId } = data;

  const hashedPassword = await bcrypt.hash(password, 12);

  // Validate manager belongs to same company if provided
  if (managerId) {
    const manager = await prisma.user.findUnique({ where: { id: managerId } });
    if (!manager || manager.companyId !== adminUser.companyId) {
      throw new AppError('Manager not found in your company.', 404);
    }
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      companyId: adminUser.companyId,
      managerId: managerId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
      managerId: true,
      createdAt: true,
    },
  });

  return user;
};

const getAllUsers = async (companyId) => {
  const users = await prisma.user.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      managerId: true,
      createdAt: true,
      manager: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

const updateUser = async (id, data, adminUser) => {
  // Ensure user belongs to same company
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser || targetUser.companyId !== adminUser.companyId) {
    throw new AppError('User not found in your company.', 404);
  }

  // Validate manager if being updated
  if (data.managerId) {
    const manager = await prisma.user.findUnique({ where: { id: data.managerId } });
    if (!manager || manager.companyId !== adminUser.companyId) {
      throw new AppError('Manager not found in your company.', 404);
    }
    // Prevent self-reference
    if (data.managerId === id) {
      throw new AppError('A user cannot be their own manager.', 400);
    }
  }

  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.role) updateData.role = data.role;
  if (data.managerId !== undefined) updateData.managerId = data.managerId;

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      managerId: true,
      manager: { select: { id: true, name: true } },
    },
  });

  return updated;
};

module.exports = { createUser, getAllUsers, updateUser };
