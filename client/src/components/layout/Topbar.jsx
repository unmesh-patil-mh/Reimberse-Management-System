import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          Welcome back, {user?.name}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{user?.email}</span>
        <Badge variant="secondary" className="text-[10px]">
          {user?.role}
        </Badge>
      </div>
    </header>
  );
}
