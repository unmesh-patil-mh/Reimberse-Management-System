import { useState } from 'react';
import { useApprovals } from '@/hooks/useApprovals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success(type === 'approve' ? 'Expense approved.' : 'Expense rejected.');
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
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pending ({approvals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No pending approvals.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((step) => (
                  <TableRow key={step.id}>
                    <TableCell>
                      <p className="font-medium">{step.expense?.createdBy?.name}</p>
                      <p className="text-xs text-muted-foreground">{step.expense?.createdBy?.email}</p>
                    </TableCell>
                    <TableCell>{step.expense?.category}</TableCell>
                    <TableCell className="font-medium">
                      {step.expense?.currency} {step.expense?.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {step.expense?.date ? new Date(step.expense.date).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">Step {step.sequenceOrder}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm"
                          className="gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          onClick={() => openDialog('approve', step.expense?.id)}
                          disabled={acting === step.expense?.id}>
                          <CheckCircle className="size-3.5" /> Approve
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => openDialog('reject', step.expense?.id)}
                          disabled={acting === step.expense?.id}>
                          <XCircle className="size-3.5" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => { if (!o) setDialog({ open: false, type: null, expenseId: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.type === 'approve' ? 'Approve' : 'Reject'} Expense</DialogTitle>
            <DialogDescription>
              Add an optional comment before {dialog.type === 'approve' ? 'approving' : 'rejecting'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Input id="comment" placeholder="Add a note..." value={comment}
              onChange={(e) => setComment(e.target.value)} disabled={!!acting} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialog({ open: false, type: null, expenseId: null })}
              disabled={!!acting}>Cancel</Button>
            <Button onClick={handleAction} disabled={!!acting}
              className={dialog.type === 'reject' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : ''}>
              {acting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {acting ? 'Processing...' : dialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
