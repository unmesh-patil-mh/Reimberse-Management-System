import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { expensesAPI, approvalsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegendContent,
} from '@/components/ui/chart';
import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid,
  Pie, PieChart, Cell, Legend,
  Area, AreaChart,
  ResponsiveContainer,
} from 'recharts';
import { Receipt, Clock, CheckCircle, XCircle, ArrowUpRight, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useExchangeRates } from '@/hooks/useCurrency';
import { toast } from 'sonner';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display.toLocaleString('en-IN')}</>;
}

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$' };

// Chart configs
const pieChartConfig = {
  PENDING:  { label: 'Pending', color: '#eab308' },
  APPROVED: { label: 'Approved', color: '#10b981' },
  REJECTED: { label: 'Rejected', color: '#ef4444' },
};
const categoryChartConfig = {
  amount: { label: 'Amount (₹)', color: '#3b82f6' },
};
const trendChartConfig = {
  amount: { label: 'Amount (₹)', color: '#10b981' },
};
const currencyChartConfig = {
  converted: { label: 'Converted (₹)', color: '#8b5cf6' },
};

// Demo expense data for seeding
const DEMO_EXPENSES = [
  { amount: 12500, currency: 'INR', category: 'Travel', description: 'Mumbai-Delhi flight tickets', date: '2026-03-01' },
  { amount: 340, currency: 'USD', category: 'Software', description: 'Annual Figma Pro license', date: '2026-03-05' },
  { amount: 8700, currency: 'INR', category: 'Office Supplies', description: 'Ergonomic chairs x3', date: '2026-03-08' },
  { amount: 150, currency: 'EUR', category: 'Training', description: 'AWS certification exam fee', date: '2026-03-10' },
  { amount: 4200, currency: 'INR', category: 'Food', description: 'Team lunch — quarterly offsite', date: '2026-03-12' },
  { amount: 89, currency: 'GBP', category: 'Books', description: 'System Design Interview books', date: '2026-03-14' },
  { amount: 21000, currency: 'INR', category: 'Travel', description: 'Bengaluru client visit + hotel 2 nights', date: '2026-03-18' },
  { amount: 499, currency: 'USD', category: 'Software', description: 'GitHub Enterprise seats (5)', date: '2026-03-20' },
  { amount: 3500, currency: 'INR', category: 'Marketing', description: 'Google Ads campaign Q1', date: '2026-03-22' },
  { amount: 75, currency: 'EUR', category: 'Training', description: 'Udemy course bundle', date: '2026-03-25' },
  { amount: 6800, currency: 'INR', category: 'Equipment', description: 'Dell monitor 27" 4K', date: '2026-03-27' },
  { amount: 250, currency: 'USD', category: 'Food', description: 'Client dinner — Hilton', date: '2026-03-28' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { rates, convert } = useExchangeRates('INR');

  const fetchData = useCallback(async () => {
    try {
      const promises = [
        expensesAPI.getMy(),
        user?.role !== 'EMPLOYEE' ? approvalsAPI.getPending() : Promise.resolve({ data: { data: [] } }),
      ];
      const results = await Promise.allSettled(promises);
      if (results[0].status === 'fulfilled') setExpenses(results[0].value.data.data || []);
      if (results[1].status === 'fulfilled') setPendingCount((results[1].value.data.data || []).length);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Seed demo data
  const seedDemoData = async () => {
    setSeeding(true);
    let created = 0;
    for (const exp of DEMO_EXPENSES) {
      try {
        await expensesAPI.create(exp);
        created++;
      } catch {
        // Skip failures (e.g., no manager chain)
      }
    }
    toast.success(`Created ${created} demo expenses!`);
    setSeeding(false);
    fetchData();
  };

  // Convert all amounts to INR for aggregation
  const toINR = (amount, currency) => {
    if (!rates || currency === 'INR') return amount;
    const rate = rates[currency];
    if (!rate) return amount;
    return amount / rate; // rate is INR→currency, so divide to get INR
  };

  const approved = expenses.filter((e) => e.status === 'APPROVED').length;
  const pending  = expenses.filter((e) => e.status === 'PENDING').length;
  const rejected = expenses.filter((e) => e.status === 'REJECTED').length;
  const totalAmount = expenses.reduce((sum, e) => sum + toINR(e.amount, e.currency), 0);
  const approvedAmount = expenses.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + toINR(e.amount, e.currency), 0);

  // Prepare chart data
  const statusData = [
    { status: 'PENDING',  count: pending,  fill: '#eab308' },
    { status: 'APPROVED', count: approved, fill: '#10b981' },
    { status: 'REJECTED', count: rejected, fill: '#ef4444' },
  ].filter(d => d.count > 0);

  // Category breakdown (converted to INR)
  const categoryMap = {};
  expenses.forEach(e => {
    if (!categoryMap[e.category]) categoryMap[e.category] = 0;
    categoryMap[e.category] += Math.round(toINR(e.amount, e.currency));
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  // Monthly trend (converted to INR)
  const monthMap = {};
  expenses.forEach(e => {
    const d = new Date(e.date);
    const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += Math.round(toINR(e.amount, e.currency));
  });
  const trendData = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));

  // Currency breakdown
  const currencyMap = {};
  expenses.forEach(e => {
    const cur = e.currency || 'INR';
    if (!currencyMap[cur]) currencyMap[cur] = { original: 0, converted: 0, count: 0 };
    currencyMap[cur].original += e.amount;
    currencyMap[cur].converted += Math.round(toINR(e.amount, e.currency));
    currencyMap[cur].count++;
  });
  const currencyData = Object.entries(currencyMap)
    .map(([currency, data]) => ({ currency, ...data }))
    .sort((a, b) => b.converted - a.converted);

  const stats = [
    { label: 'Total Expenses',  value: expenses.length, icon: Receipt,     color: 'text-foreground' },
    { label: 'Pending',         value: pending,          icon: Clock,       color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Approved',        value: approved,         icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Rejected',        value: rejected,         icon: XCircle,     color: 'text-red-600 dark:text-red-400' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening with your expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {expenses.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={seedDemoData}
              disabled={seeding}
            >
              {seeding ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              {seeding ? 'Seeding...' : 'Seed Demo Data'}
            </Button>
          )}
          <Link to="/expenses">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              View all <ArrowUpRight className="size-3" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={item}>
              <Card className="rounded-2xl hover:shadow-md dark:hover:shadow-none hover:border-border transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                    <div className={`flex size-8 items-center justify-center rounded-lg bg-accent ${s.color}`}>
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold tracking-tight">
                    <AnimatedNumber value={s.value} />
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Amount Cards + Pending Approvals */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="rounded-2xl h-full">
            <CardContent className="p-5">
              <div className="grid gap-6 sm:grid-cols-2 h-full">
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-medium text-muted-foreground mb-2">Total Claimed (INR equivalent)</span>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <span className="text-4xl font-bold tracking-tight">
                        <AnimatedNumber value={Math.round(totalAmount)} />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      across {expenses.length} expense(s) in {Object.keys(currencyMap).length} currenc{Object.keys(currencyMap).length === 1 ? 'y' : 'ies'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between border-l border-border/50 pl-6">
                  <span className="text-xs font-medium text-muted-foreground mb-2">Approved Amount</span>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">₹</span>
                      <span className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        <AnimatedNumber value={Math.round(approvedAmount)} />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expenses.length > 0 ? `${Math.round((approved / expenses.length) * 100)}% approval rate` : 'No data yet'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          {user?.role !== 'EMPLOYEE' && pendingCount > 0 ? (
            <Card className="rounded-2xl border-yellow-500/20 bg-yellow-500/5 h-full">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-500/10 mb-3">
                    <Clock className="size-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm font-medium">Needs Your Attention</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingCount} expense{pendingCount > 1 ? 's' : ''} waiting for your review
                  </p>
                </div>
                <Link to="/approvals" className="mt-4">
                  <Button size="sm" variant="outline" className="w-full gap-2 text-xs border-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/5">
                    Review Approvals <ArrowUpRight className="size-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl h-full">
              <CardContent className="p-5 flex flex-col justify-center items-center h-full text-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 mb-3">
                  <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium">All Clear</p>
                <p className="text-xs text-muted-foreground mt-1">No pending actions required.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* ═══ CHARTS SECTION ═══ */}
      {expenses.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-7">

          {/* Category Bar Chart */}
          <motion.div variants={item} className="lg:col-span-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spend by Category</CardTitle>
                <CardDescription className="text-xs">Amounts converted to INR via live exchange rates</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ChartContainer config={categoryChartConfig} className="h-[280px] w-full !aspect-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                          tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                            />
                          }
                        />
                        <Bar
                          dataKey="amount"
                          fill="var(--color-amount)"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                    No category data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Pie Chart */}
          <motion.div variants={item} className="lg:col-span-3">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
                <CardDescription className="text-xs">Current state of all your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ChartContainer config={pieChartConfig} className="h-[280px] w-full !aspect-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                        <Pie
                          data={statusData}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={85}
                          strokeWidth={2}
                          stroke="hsl(var(--background))"
                        >
                          {statusData.map((entry) => (
                            <Cell key={entry.status} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend
                          content={<ChartLegendContent nameKey="status" />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                    No status data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Currency Breakdown Table */}
      {currencyData.length > 1 && (
        <motion.div variants={item}>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Multi-Currency Breakdown
                {rates && <Badge variant="secondary" className="text-[9px] font-normal">Live rates</Badge>}
              </CardTitle>
              <CardDescription className="text-xs">
                All amounts converted to INR using real-time exchange rates from exchangerate-api.com
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Currency</TableHead>
                    <TableHead className="text-xs">Expenses</TableHead>
                    <TableHead className="text-xs">Original Total</TableHead>
                    <TableHead className="text-xs">Rate (1 INR)</TableHead>
                    <TableHead className="text-xs text-right">INR Equivalent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencyData.map((c) => (
                    <TableRow key={c.currency} className="border-border/50 hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-accent text-xs font-bold">
                            {CURRENCY_SYMBOLS[c.currency] || c.currency.charAt(0)}
                          </div>
                          {c.currency}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{c.count}</TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {(CURRENCY_SYMBOLS[c.currency] || '') + c.original.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="tabular-nums text-xs text-muted-foreground">
                        {rates?.[c.currency] ? rates[c.currency].toFixed(4) : '—'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-sm">
                        ₹{c.converted.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Monthly Trend Area Chart */}
      {trendData.length > 0 && (
        <motion.div variants={item}>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Spend Trend
                    <TrendingUp className="size-3.5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="text-xs">Monthly spending converted to INR</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trendChartConfig} className="h-[220px] w-full !aspect-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-amount)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-amount)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={11}
                      tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="var(--color-amount)"
                      strokeWidth={2}
                      fill="url(#fillAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Expenses Table */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
              {expenses.length > 5 && (
                <Link to="/expenses">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    View all <ArrowUpRight className="size-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent border border-border mx-auto mb-4">
                  <Receipt className="size-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No expenses yet</p>
                <p className="text-xs text-muted-foreground mt-1">Submit your first expense or seed demo data to get started.</p>
                <Button size="sm" onClick={seedDemoData} disabled={seeding} className="mt-4 gap-2 text-xs">
                  {seeding ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                  {seeding ? 'Seeding...' : 'Seed Demo Data'}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Currency</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.slice(0, 6).map((exp, i) => {
                    const cfg = STATUS[exp.status];
                    const sym = CURRENCY_SYMBOLS[exp.currency] || '';
                    return (
                      <motion.tr
                        key={exp.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell>
                          <Link to={`/expenses/${exp.id}`} className="font-medium text-sm hover:underline underline-offset-4">
                            {exp.category}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium tabular-nums">{sym}{exp.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[9px] font-mono px-1.5">{exp.currency}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${cfg.cls}`}>{cfg.label}</Badge>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
