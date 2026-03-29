import { useParams, Link } from 'react-router-dom';
import { useExpenseDetail } from '@/hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Calendar, User, IndianRupee, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS = {
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const STEP_ICON = { PENDING: Clock, APPROVED: CheckCircle, REJECTED: XCircle };

const STEP_COLOR = {
  PENDING:  { text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
  APPROVED: { text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  REJECTED: { text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ExpenseDetail() {
  const { id } = useParams();
  const { expense, loading, error } = useExpenseDetail(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="space-y-4">
        <Link to="/expenses">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="size-3.5" /> Back
          </Button>
        </Link>
        <Card className="rounded-2xl border-red-500/20 bg-red-500/5">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error || 'Expense not found.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cfg = STATUS[expense.status];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Back + Title */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/expenses">
            <Button variant="outline" size="icon" className="size-8">
              <ArrowLeft className="size-3.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{expense.category}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Expense Details</p>
          </div>
        </div>
        <Badge variant="outline" className={`text-xs ${cfg.cls}`}>{cfg.label}</Badge>
      </motion.div>

      {/* Info Cards */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Amount',
                  value: `₹${expense.amount.toLocaleString('en-IN')}`,
                  sub: expense.currency,
                  icon: IndianRupee,
                  color: 'text-foreground',
                },
                {
                  label: 'Date',
                  value: new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  sub: 'Submission date',
                  icon: Calendar,
                  color: 'text-muted-foreground',
                },
                {
                  label: 'Submitted By',
                  value: expense.createdBy?.name,
                  sub: expense.createdBy?.email,
                  icon: User,
                  color: 'text-muted-foreground',
                },
                {
                  label: 'Progress',
                  value: `Step ${expense.currentStepOrder} of ${expense.approvalSteps?.length || 0}`,
                  sub: expense.status === 'APPROVED' ? 'Completed' : expense.status === 'REJECTED' ? 'Stopped' : 'In progress',
                  icon: FileText,
                  color: 'text-muted-foreground',
                },
              ].map((field, i) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.label}
                    className={`p-5 ${i < 3 ? 'lg:border-r border-border/50' : ''} ${i < 2 ? 'max-lg:border-b border-border/50' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`size-3.5 ${field.color}`} />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{field.label}</span>
                    </div>
                    <p className="text-sm font-semibold">{field.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{field.sub}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Description */}
      {expense.description && (
        <motion.div variants={item}>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Description</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{expense.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Approval Timeline */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approval Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {!expense.approvalSteps || expense.approvalSteps.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No approval steps generated.</p>
            ) : (
              <div className="space-y-0 ml-1">
                {expense.approvalSteps.map((step, i) => {
                  const Icon = STEP_ICON[step.status];
                  const colors = STEP_COLOR[step.status];
                  const isLast = i === expense.approvalSteps.length - 1;
                  const isCurrent = step.sequenceOrder === expense.currentStepOrder && expense.status === 'PENDING';

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      {/* Timeline line + icon */}
                      <div className="flex flex-col items-center">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl border-2 ${colors.border} ${colors.bg} ${isCurrent ? 'ring-2 ring-ring/20 ring-offset-2 ring-offset-background' : ''}`}>
                          <Icon className={`size-4 ${colors.text}`} />
                        </div>
                        {!isLast && (
                          <div className={`w-px flex-1 min-h-[24px] ${step.status !== 'PENDING' ? 'bg-border' : 'bg-border/30'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-6 pt-1 ${isLast ? 'pb-0' : ''}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{step.approver?.name || 'Unknown'}</p>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${STATUS[step.status].cls}`}>
                            {step.status}
                          </Badge>
                          {isCurrent && (
                            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0 animate-pulse">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {step.approver?.email} · Step {step.sequenceOrder}
                        </p>
                        {step.comments && (
                          <div className="mt-2 rounded-lg bg-accent/50 border border-border/50 px-3 py-2">
                            <p className="text-xs text-muted-foreground italic">"{step.comments}"</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
