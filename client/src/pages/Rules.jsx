import { useState } from 'react';
import { useRules } from '@/hooks/useRules';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useEffect } from 'react';

const RULE_TYPES = ['PERCENTAGE', 'SPECIFIC', 'HYBRID'];

export default function Rules() {
  const { rules, loading, create } = useRules();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    type: 'PERCENTAGE',
    percentageValue: '',
    specificApproverId: '',
  });

  // Fetch company users for specific approver dropdown
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      usersAPI.getAll().then((res) => setUsers(res.data.data || [])).catch(() => {});
    }
  }, [user]);

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { type: form.type };

    if (form.type === 'PERCENTAGE' || form.type === 'HYBRID') {
      if (!form.percentageValue) return toast.error('Percentage value is required.');
      payload.percentageValue = parseFloat(form.percentageValue);
    }
    if (form.type === 'SPECIFIC' || form.type === 'HYBRID') {
      if (!form.specificApproverId) return toast.error('Specific approver is required.');
      payload.specificApproverId = form.specificApproverId;
    }

    setSubmitting(true);
    try {
      await create(payload);
      toast.success('Approval rule created.');
      setForm({ type: 'PERCENTAGE', percentageValue: '', specificApproverId: '' });
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create rule.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Approval Rules</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" /> New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Approval Rule</DialogTitle>
              <DialogDescription>Define how expenses get auto-approved.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Rule Type</Label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handle}
                  disabled={submitting}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {RULE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {(form.type === 'PERCENTAGE' || form.type === 'HYBRID') && (
                <div className="space-y-2">
                  <Label htmlFor="percentageValue">Percentage Threshold (0–100)</Label>
                  <Input id="percentageValue" name="percentageValue" type="number"
                    min="0" max="100" placeholder="50"
                    value={form.percentageValue} onChange={handle} disabled={submitting} />
                </div>
              )}

              {(form.type === 'SPECIFIC' || form.type === 'HYBRID') && (
                <div className="space-y-2">
                  <Label htmlFor="specificApproverId">Specific Approver</Label>
                  <select
                    id="specificApproverId"
                    name="specificApproverId"
                    value={form.specificApproverId}
                    onChange={handle}
                    disabled={submitting}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select approver...</option>
                    {users
                      .filter((u) => u.role === 'MANAGER' || u.role === 'ADMIN')
                      .map((u) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                  </select>
                </div>
              )}

              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Rule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Rules ({rules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No rules configured. Create one above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Specific Approver</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Badge variant="outline">{rule.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {rule.percentageValue != null ? `${rule.percentageValue}%` : '—'}
                    </TableCell>
                    <TableCell>
                      {rule.specificApprover ? (
                        <span>
                          {rule.specificApprover.name}{' '}
                          <span className="text-xs text-muted-foreground">({rule.specificApprover.email})</span>
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(rule.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
