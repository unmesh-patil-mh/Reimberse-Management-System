import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  CheckCircle,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: null },
  { label: 'Expenses', path: '/expenses', icon: Receipt, roles: null },
  { label: 'Approvals', path: '/approvals', icon: CheckCircle, roles: ['ADMIN', 'MANAGER'] },
  { label: 'Team', path: '/team', icon: Users, roles: ['ADMIN'] },
  { label: 'Rules', path: '/rules', icon: BookOpen, roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filtered = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-border/50 bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-border">
          <Zap className="size-4 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden text-sm font-bold tracking-tight whitespace-nowrap"
            >
              ReimburseFlow
            </motion.span>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto size-7 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
        </Button>
      </div>

      <Separator className="opacity-50" />

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-accent border border-border/50"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn('relative z-10 size-4 shrink-0 transition-colors')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator className="opacity-50" />

      {/* Bottom — User + Logout */}
      <div className="p-3">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 rounded-lg bg-accent/50 border border-border/50 p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <Badge variant="secondary" className="mt-0.5 text-[9px] px-1.5 py-0 h-4">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn(
            'w-full gap-2 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="size-3.5" />
          {!collapsed && 'Sign out'}
        </Button>
      </div>
    </aside>
  );
}
