import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import ExpenseDetail from '@/pages/ExpenseDetail';
import Approvals from '@/pages/Approvals';
import Rules from '@/pages/Rules';

// Role-based route guard
function RoleGuard({ roles, children }) {
  const { user } = useAuth();
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected — inside AppLayout (sidebar + topbar) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/:id" element={<ExpenseDetail />} />
            <Route
              path="/approvals"
              element={
                <RoleGuard roles={['ADMIN', 'MANAGER']}>
                  <Approvals />
                </RoleGuard>
              }
            />
            <Route
              path="/rules"
              element={
                <RoleGuard roles={['ADMIN']}>
                  <Rules />
                </RoleGuard>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="dark" />
      </AuthProvider>
    </BrowserRouter>
  );
}
