require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const approvalRoutes = require('./routes/approval.routes');
const ruleRoutes = require('./routes/rule.routes');
const companyRoutes = require('./routes/company.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── ROUTES ─────────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/companies', companyRoutes);

// ─── ERROR HANDLER ──────────────────────────────────────
app.use(errorHandler);

// ─── START ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
});
