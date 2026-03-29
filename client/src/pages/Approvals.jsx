import { useState } from 'react';
import { useApprovals } from '@/hooks/useApprovals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Approvals() {
  const { approvals, loading, approve, reject } = useApprovals();
  const [dialog, setDialog] = useState({ open: false, type: null, expenseId: null });
  const [comment, setComment] = useState('');
  const [acting, setActing] = useState(null);

  const openDialog = (type, expenseId) => {
    setDialog({ open: true, type, expenseId });
    setComment('');
  };

  const handleAction = async () => {
    const { type, expenseId } = dialog;
    setActing(expenseId);
    try {
      if (type === 'approve') await approve(expenseId, comment);
      else await reject(expenseId, comment);
      toast.success(type === 'approve' ? 'Expense approved successfully.' : 'Expense rejected.');
      setDialog({ open: false, type: null, expenseId: null });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${type}.`);
    } finally {
      setActing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {approvals.length} expense{approvals.length !== 1 ? 's' : ''} waiting for your decision
          </p>
        </div>
        {approvals.length > 0 && (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-xs">
            {approvals.length} Pending
          </Badge>
        )}
      </motion.div>

      {/* Content */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {approvals.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mx-auto mb-4">
                  <Inbox className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No expense requests need your attention right now.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs pl-6">Employee</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Step</TableHead>
                    <TableHead className="text-xs text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((step, i) => (
                    <motion.tr
                      key={step.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-muted-foreground shrink-0">
                            {step.expense?.createdBy?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{step.expense?.createdBy?.name}</p>
                            <p className="text-[11px] text-muted-foreground">{step.expense?.createdBy?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{step.expense?.category}</TableCell>
                      <TableCell className="font-medium tabular-nums text-sm">
                        ₹{step.expense?.amount?.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {step.expense?.date ? new Date(step.expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] font-mono">#{step.sequenceOrder}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                            onClick={() => openDialog('approve', step.expense?.id)}
                            disabled={acting === step.expense?.id}
                          >
                            <CheckCircle className="size-3" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1.5 text-xs text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/10"
                            onClick={() => openDialog('reject', step.expense?.id)}
                            disabled={acting === step.expense?.id}
                          >
                            <XCircle className="size-3" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => { if (!o) setDialog({ open: false, type: null, expenseId: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialog.type === 'approve' ? (
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="size-4 text-red-600 dark:text-red-400" />
              )}
              {dialog.type === 'approve' ? 'Approve' : 'Reject'} Expense
            </DialogTitle>
            <DialogDescription>
              {dialog.type === 'approve'
                ? 'Confirm approval and optionally add a comment.'
                : 'This will reject the expense and stop the approval flow.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-xs text-muted-foreground">Comment (optional)</Label>
            <Input
              id="comment"
              placeholder="Add a note..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!!acting}
              className="h-10"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialog({ open: false, type: null, expenseId: null })}
              disabled={!!acting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={!!acting}
              variant={dialog.type === 'reject' ? 'destructive' : 'default'}
              className="text-xs"
            >
              {acting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {acting ? 'Processing...' : dialog.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
