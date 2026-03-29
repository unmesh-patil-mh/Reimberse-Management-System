import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

// ── Users ───────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
};

// ── Expenses ────────────────────────────────────
export const expensesAPI = {
  getMy: () => api.get('/expenses/my'),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
};

// ── Approvals ───────────────────────────────────
export const approvalsAPI = {
  getPending: () => api.get('/approvals/pending'),
  approve: (expenseId, data) => api.post(`/approvals/${expenseId}/approve`, data),
  reject: (expenseId, data) => api.post(`/approvals/${expenseId}/reject`, data),
};

// ── Rules ───────────────────────────────────────
export const rulesAPI = {
  getAll: () => api.get('/rules'),
  create: (data) => api.post('/rules', data),
};

// ── Company ─────────────────────────────────────
export const companyAPI = {
  get: () => api.get('/companies'),
};

export default api;
