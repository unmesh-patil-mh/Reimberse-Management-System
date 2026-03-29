import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { expensesAPI, approvalsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Receipt, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [expRes, appRes] = await Promise.allSettled([
          expensesAPI.getMy(),
          user?.role !== 'EMPLOYEE' ? approvalsAPI.getPending() : Promise.resolve({ data: { data: [] } }),
        ]);
        if (expRes.status === 'fulfilled') setExpenses(expRes.value.data.data || []);
        if (appRes.status === 'fulfilled') setPendingCount((appRes.value.data.data || []).length);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const approved = expenses.filter((e) => e.status === 'APPROVED').length;
  const pending  = expenses.filter((e) => e.status === 'PENDING').length;
  const rejected = expenses.filter((e) => e.status === 'REJECTED').length;

  const stats = [
    { label: 'Total Expenses',    value: expenses.length, icon: Receipt,     color: 'text-foreground' },
    { label: 'Pending',           value: pending,         icon: Clock,       color: 'text-yellow-400' },
    { label: 'Approved',          value: approved,        icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Rejected',          value: rejected,        icon: XCircle,     color: 'text-red-400' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                <Icon className={`size-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending for manager/admin */}
      {user?.role !== 'EMPLOYEE' && pendingCount > 0 && (
        <Card className="rounded-2xl border-yellow-500/20">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">Pending Your Approval</p>
              <p className="text-xs text-muted-foreground">{pendingCount} expense(s) need action</p>
            </div>
            <Link to="/approvals">
              <Badge variant="secondary" className="cursor-pointer">View →</Badge>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent Expenses */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No expenses yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.slice(0, 5).map((exp) => {
                  const cfg = STATUS[exp.status];
                  return (
                    <TableRow key={exp.id}>
                      <TableCell>
                        <Link to={`/expenses/${exp.id}`} className="font-medium hover:underline">
                          {exp.category}
                        </Link>
                      </TableCell>
                      <TableCell>{exp.currency} {exp.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(exp.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.cls}>{cfg.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
