import { useParams, Link } from 'react-router-dom';
import { useExpenseDetail } from '@/hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const STEP_ICON = {
  PENDING:  Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
};

const STEP_COLOR = {
  PENDING:  'text-yellow-400 border-yellow-500/30',
  APPROVED: 'text-emerald-400 border-emerald-500/30',
  REJECTED: 'text-red-400 border-red-500/30',
};

export default function ExpenseDetail() {
  const { id } = useParams();
  const { expense, loading, error } = useExpenseDetail(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="space-y-4">
        <Link to="/expenses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" /> Back
          </Button>
        </Link>
        <p className="text-sm text-red-400">{error || 'Expense not found.'}</p>
      </div>
    );
  }

  const cfg = STATUS[expense.status];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/expenses">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="size-4" /> Back to Expenses
        </Button>
      </Link>

      {/* Expense Info */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{expense.category}</CardTitle>
          <Badge variant="outline" className={cfg.cls}>{cfg.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-lg font-bold">{expense.currency} {expense.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium">{new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Submitted by</p>
              <p className="text-sm font-medium">{expense.createdBy?.name}</p>
              <p className="text-xs text-muted-foreground">{expense.createdBy?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Step</p>
              <p className="text-sm font-medium">Step {expense.currentStepOrder} of {expense.approvalSteps?.length || 0}</p>
            </div>
          </div>
          {expense.description && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{expense.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Approval Steps Timeline */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Approval Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {!expense.approvalSteps || expense.approvalSteps.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No approval steps.</p>
          ) : (
            <div className="space-y-0">
              {expense.approvalSteps.map((step, i) => {
                const Icon = STEP_ICON[step.status];
                const colorCls = STEP_COLOR[step.status];
                const isLast = i === expense.approvalSteps.length - 1;
                return (
                  <div key={step.id} className="flex gap-4">
                    {/* Timeline line + icon */}
                    <div className="flex flex-col items-center">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${colorCls} bg-card`}>
                        <Icon className="size-4" />
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-border" />}
                    </div>

                    {/* Content */}
                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{step.approver?.name || 'Unknown'}</p>
                        <Badge variant="outline" className={`text-[10px] ${STATUS[step.status].cls}`}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {step.approver?.email} · Step {step.sequenceOrder}
                      </p>
                      {step.comments && (
                        <p className="mt-1 text-xs text-muted-foreground italic">
                          "{step.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
