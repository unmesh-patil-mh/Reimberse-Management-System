import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Loader2, Receipt, ArrowUpRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useCurrencies } from '@/hooks/useCurrency';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const blankForm = { amount: '', category: '', description: '', date: '', currency: 'INR' };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Expenses() {
  const { expenses, loading, create } = useExpenses();
  const { currencies } = useCurrencies();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [search, setSearch] = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      return toast.error('Amount, category, and date are required.');
    }
    setSubmitting(true);
    try {
      await create({
        amount: parseFloat(form.amount),
        category: form.category,
        currency: form.currency,
        description: form.description || undefined,
        date: form.date,
      });
      toast.success('Expense submitted for approval.');
      setForm(blankForm);
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create. Make sure you have a manager assigned.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = expenses.filter(
    (e) => e.category?.toLowerCase().includes(search.toLowerCase()) ||
           e.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{expenses.length} total submission{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="gap-2 h-9 text-xs" />}
          >
            <Plus className="size-3.5" />
            New Expense
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Expense</DialogTitle>
              <DialogDescription>Submit a new expense for dynamic approval routing.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs text-muted-foreground">Amount</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00"
                    value={form.amount} onChange={handle} disabled={submitting}
                    className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-xs text-muted-foreground">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency}
                    onChange={handle}
                    disabled={submitting}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol}) — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs text-muted-foreground">Category</Label>
                <Input id="category" name="category" placeholder="e.g. Travel, Food, Equipment"
                  value={form.category} onChange={handle} disabled={submitting}
                  className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs text-muted-foreground">Description</Label>
                <Textarea id="description" name="description" placeholder="Add details about this expense..."
                  value={form.description} onChange={handle} disabled={submitting} rows={3}
                  className="resize-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs text-muted-foreground">Date</Label>
                <Input id="date" name="date" type="date"
                  value={form.date} onChange={handle} disabled={submitting}
                  className="h-10" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      {expenses.length > 0 && (
        <motion.div variants={item} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </motion.div>
      )}

      {/* Table */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {filtered.length === 0 && expenses.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent border border-dashed border-border mx-auto mb-4">
                  <Receipt className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No expenses yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px] mx-auto">
                  Submit your first expense and the system will dynamically generate approval steps.
                </p>
                <Button size="sm" onClick={() => setOpen(true)} className="mt-4 gap-2 text-xs">
                  <Plus className="size-3.5" /> Create Your First Expense
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No matching expenses found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs pl-6">Category</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Currency</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right pr-6">Steps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((exp, i) => {
                    const cfg = STATUS[exp.status];
                    return (
                      <motion.tr
                        key={exp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <TableCell className="pl-6">
                          <Link to={`/expenses/${exp.id}`} className="group/link">
                            <span className="font-medium text-sm group-hover/link:underline underline-offset-4">{exp.category}</span>
                            {exp.description && (
                              <p className="text-[11px] text-muted-foreground truncate max-w-[200px] mt-0.5">{exp.description}</p>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium tabular-nums text-sm">{exp.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[9px] font-mono px-1.5">{exp.currency || 'INR'}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${cfg.cls}`}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="text-xs text-muted-foreground">{exp.approvalSteps?.length || 0} step(s)</span>
                          <ArrowUpRight className="inline-block ml-1 size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
