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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: null },
  { label: 'Expenses', path: '/expenses', icon: Receipt, roles: null },
  { label: 'Approvals', path: '/approvals', icon: CheckCircle, roles: ['ADMIN', 'MANAGER'] },
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
        'flex h-screen flex-col border-r border-border bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight">ReimburseFlow</span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      <Separator />

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom — User + Logout */}
      <div className="p-3">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn('w-full gap-2 text-xs text-muted-foreground', collapsed && 'justify-center')}
        >
          <LogOut className="size-3.5" />
          {!collapsed && 'Sign out'}
        </Button>
      </div>
    </aside>
  );
}
