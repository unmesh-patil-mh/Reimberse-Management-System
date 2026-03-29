import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const blankForm = { amount: '', category: '', description: '', date: '' };

export default function Expenses() {
  const { expenses, loading, create } = useExpenses();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(blankForm);

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
        description: form.description || undefined,
        date: form.date,
      });
      toast.success('Expense submitted.');
      setForm(blankForm);
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              New Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Expense</DialogTitle>
              <DialogDescription>Submit a new expense for approval.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00"
                    value={form.amount} onChange={handle} disabled={submitting} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g. Travel"
                    value={form.category} onChange={handle} disabled={submitting} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Details (optional)"
                  value={form.description} onChange={handle} disabled={submitting} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date"
                  value={form.date} onChange={handle} disabled={submitting} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Expenses ({expenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No expenses yet. Create one above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Approvers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => {
                  const cfg = STATUS[exp.status];
                  return (
                    <TableRow key={exp.id}>
                      <TableCell>
                        <Link to={`/expenses/${exp.id}`} className="font-medium hover:underline">
                          {exp.category}
                        </Link>
                        {exp.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{exp.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{exp.currency} {exp.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.cls}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {exp.approvalSteps?.length || 0} step(s)
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
