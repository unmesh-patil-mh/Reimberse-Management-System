import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, ArrowRight, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.companyName) {
      return toast.error('All fields are required.');
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created! Welcome.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
    { id: 'email', label: 'Work Email', placeholder: 'you@company.com', type: 'email' },
    { id: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
    { id: 'companyName', label: 'Company Name', placeholder: 'Acme Corp', type: 'text' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--muted)/0.3),transparent_60%)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-border">
              <Zap className="size-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">ReimburseFlow</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="size-8">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-4">
            Setup takes<br />
            <span className="text-muted-foreground">60 seconds.</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Create your company workspace, invite your team, configure approval rules — all from one dashboard.
          </p>
        </motion.div>
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-3">
            {['Dynamic Approvals', 'Role-Based Access', 'Multi-Company'].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-lg bg-accent/50 border border-border/50 px-3 py-2"
              >
                <p className="text-[11px] text-muted-foreground">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 border border-border">
                <Zap className="size-4 text-primary" />
              </div>
              <span className="text-sm font-bold">ReimburseFlow</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="size-8">
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Create your workspace</h2>
            <p className="text-sm text-muted-foreground mt-1">Start managing expenses in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="space-y-1.5"
              >
                <Label htmlFor={f.id} className="text-xs text-muted-foreground">{f.label}</Label>
                <Input
                  id={f.id}
                  name={f.id}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-10"
                />
              </motion.div>
            ))}
            <Button type="submit" className="w-full h-10 gap-2 group mt-2" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create account'}
              {!loading && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
