import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of your expenses and approvals' },
  '/expenses': { title: 'Expenses', sub: 'Track and manage your expense submissions' },
  '/approvals': { title: 'Approvals', sub: 'Review and act on pending expense requests' },
  '/rules': { title: 'Approval Rules', sub: 'Configure dynamic approval workflows' },
  '/team': { title: 'Team', sub: 'Manage users, roles, and reporting chains' },
};

export default function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const basePath = '/' + location.pathname.split('/')[1];
  const page = pageTitles[basePath] || { title: '', sub: '' };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{page.title}</h2>
          <p className="text-[11px] text-muted-foreground">{page.sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="size-4 rotate-0 scale-100 transition-transform" />
          ) : (
            <Moon className="size-4 rotate-0 scale-100 transition-transform" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 border border-border/50 pl-3 pr-1.5 py-1">
          <span className="text-xs text-muted-foreground">{user?.email}</span>
          <Badge variant="secondary" className="text-[9px] rounded-full px-2 h-5">
            {user?.role}
          </Badge>
        </div>
      </div>
    </header>
  );
}
