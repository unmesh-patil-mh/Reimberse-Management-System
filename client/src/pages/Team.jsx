import { useState, useEffect } from 'react';
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
import { Plus, Loader2, Users, Shield, UserCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ROLE_STYLES = {
  ADMIN:    { cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: Shield },
  MANAGER:  { cls: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', icon: UserCheck },
  EMPLOYEE: { cls: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20', icon: User },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Team() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'EMPLOYEE', managerId: '',
  });

  const fetchUsers = async () => {
    try {
      const { data } = await usersAPI.getAll();
      setUsers(data.data || []);
    } catch {
      toast.error('Failed to load team.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error('Name, email, and password are required.');
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.managerId) delete payload.managerId;
      await usersAPI.create(payload);
      toast.success('Team member added.');
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE', managerId: '' });
      setOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const managers = users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN');
  const byRole = { ADMIN: 0, MANAGER: 0, EMPLOYEE: 0 };
  users.forEach(u => { if (byRole[u.role] !== undefined) byRole[u.role]++; });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} member{users.length !== 1 ? 's' : ''} in your organization</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="gap-2 h-9 text-xs" />}
          >
            <Plus className="size-3.5" /> Add Member
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Create a new user in your organization.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input name="name" placeholder="Jane Smith" value={form.name} onChange={handle}
                    disabled={submitting} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input name="email" type="email" placeholder="jane@company.com" value={form.email}
                    onChange={handle} disabled={submitting} className="h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <Input name="password" type="password" placeholder="••••••••" value={form.password}
                  onChange={handle} disabled={submitting} className="h-10" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <select name="role" value={form.role} onChange={handle} disabled={submitting}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Reports To</Label>
                  <select name="managerId" value={form.managerId} onChange={handle} disabled={submitting}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="">None (top-level)</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="gap-2 text-xs">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {submitting ? 'Adding...' : 'Add Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Role Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(ROLE_STYLES).map(([role, style]) => {
          const Icon = style.icon;
          return (
            <motion.div key={role} variants={item}>
              <Card className="rounded-xl hover:shadow-sm dark:hover:shadow-none transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`flex size-9 items-center justify-center rounded-lg border ${style.cls}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{role}s</p>
                    <p className="text-lg font-bold">{byRole[role]}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      <motion.div variants={item}>
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {users.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent border border-dashed border-border mx-auto mb-4">
                  <Users className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No team members</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first team member to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs pl-6">Member</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Reports To</TableHead>
                    <TableHead className="text-xs text-right pr-6">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u, i) => {
                    const style = ROLE_STYLES[u.role] || ROLE_STYLES.EMPLOYEE;
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-muted-foreground shrink-0">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-[11px] text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${style.cls}`}>{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {u.manager ? (
                            <span className="text-sm">{u.manager.name}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6 text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
