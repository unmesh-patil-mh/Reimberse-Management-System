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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('All fields are required.');

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--muted)/0.3),transparent_60%)]" />
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
            Expense approvals,<br />
            <span className="text-muted-foreground">automated.</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Dynamic multi-step approval workflows powered by configurable rules. No hardcoded chains — everything from the database.
          </p>
        </motion.div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-2">
            {['A', 'M', 'E'].map((l) => (
              <div key={l} className="flex size-8 items-center justify-center rounded-full bg-accent border-2 border-background text-[10px] font-bold text-muted-foreground">
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Built for Admin, Manager & Employee workflows</p>
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
            <h2 className="text-xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full h-10 gap-2 group" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-foreground font-medium hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
