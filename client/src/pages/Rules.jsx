import { useState, useEffect } from 'react';
import { useRules } from '@/hooks/useRules';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Loader2, BookOpen, Percent, UserCheck, Layers, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const RULE_TYPES = ['PERCENTAGE', 'SPECIFIC', 'HYBRID'];

const RULE_INFO = {
  PERCENTAGE: { icon: Percent, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Approves when X% of steps are completed' },
  SPECIFIC:   { icon: UserCheck, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Approves when a specific person signs off' },
  HYBRID:     { icon: Layers, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', desc: 'Either percentage or specific — whichever passes first' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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

  const ruleInfo = RULE_INFO[form.type];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const byType = Object.fromEntries(RULE_TYPES.map(t => [t, rules.filter(r => r.type === t).length]));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approval Rules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure how expenses get automatically resolved</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="gap-2 h-9 text-xs" />}
          >
            <Plus className="size-3.5" /> New Rule
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Approval Rule</DialogTitle>
              <DialogDescription>Rules are evaluated after every approval action — fully dynamic.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Rule Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {RULE_TYPES.map((t) => {
                    const info = RULE_INFO[t];
                    const Icon = info.icon;
                    const isSelected = form.type === t;
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setForm(p => ({ ...p, type: t }))}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs transition-all ${
                          isSelected
                            ? `${info.bg} ${info.color}`
                            : 'border-border text-muted-foreground hover:border-border/80'
                        }`}
                      >
                        <Icon className="size-4" />
                        <span className="font-medium">{t}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 mt-1">
                  <Info className="size-3 mt-0.5 shrink-0" />
                  {ruleInfo.desc}
                </p>
              </div>

              {(form.type === 'PERCENTAGE' || form.type === 'HYBRID') && (
                <div className="space-y-2">
                  <Label htmlFor="percentageValue" className="text-xs text-muted-foreground">Percentage Threshold (0–100)</Label>
                  <Input id="percentageValue" name="percentageValue" type="number"
                    min="0" max="100" placeholder="e.g. 50"
                    value={form.percentageValue} onChange={handle} disabled={submitting}
                    className="h-10" />
                </div>
              )}

              {(form.type === 'SPECIFIC' || form.type === 'HYBRID') && (
                <div className="space-y-2">
                  <Label htmlFor="specificApproverId" className="text-xs text-muted-foreground">Specific Approver</Label>
                  <select
                    id="specificApproverId"
                    name="specificApproverId"
                    value={form.specificApproverId}
                    onChange={handle}
                    disabled={submitting}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                <Button type="submit" disabled={submitting} className="gap-2 text-xs">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Rule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Type Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {RULE_TYPES.map((t) => {
          const info = RULE_INFO[t];
          const Icon = info.icon;
          return (
            <motion.div key={t} variants={item}>
              <Card className="rounded-xl hover:shadow-sm dark:hover:shadow-none transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`flex size-9 items-center justify-center rounded-lg border ${info.bg}`}>
                    <Icon className={`size-4 ${info.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t}</p>
                    <p className="text-lg font-bold">{byType[t]}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rules Table */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {rules.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent border border-dashed border-border mx-auto mb-4">
                  <BookOpen className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No rules configured</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[260px] mx-auto">
                  Create your first approval rule to enable dynamic expense resolution.
                </p>
                <Button size="sm" onClick={() => setOpen(true)} className="mt-4 gap-2 text-xs">
                  <Plus className="size-3.5" /> Create Rule
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs pl-6">Type</TableHead>
                    <TableHead className="text-xs">Threshold</TableHead>
                    <TableHead className="text-xs">Specific Approver</TableHead>
                    <TableHead className="text-xs text-right pr-6">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule, i) => {
                    const info = RULE_INFO[rule.type];
                    const Icon = info.icon;
                    return (
                      <motion.tr
                        key={rule.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <div className={`flex size-6 items-center justify-center rounded-md border ${info.bg}`}>
                              <Icon className={`size-3 ${info.color}`} />
                            </div>
                            <Badge variant="outline" className={`text-[10px] ${info.bg} ${info.color}`}>{rule.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {rule.percentageValue != null ? (
                            <span className="font-medium">{rule.percentageValue}%</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {rule.specificApprover ? (
                            <div className="flex items-center gap-2">
                              <div className="flex size-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-muted-foreground">
                                {rule.specificApprover.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm">{rule.specificApprover.name}</span>
                                <span className="text-xs text-muted-foreground ml-1.5">({rule.specificApprover.email})</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6 text-xs text-muted-foreground">
                          {new Date(rule.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
