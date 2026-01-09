import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Package,
  Store,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
  TrendingUp,
  RefreshCw,
  Brain,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, managerOnly: false },
  { label: 'Products', href: '/products', icon: Package, managerOnly: false },
  { label: 'Stores', href: '/stores', icon: Store, managerOnly: false },
  { label: 'Stock', href: '/stock', icon: Boxes, managerOnly: false },
  { label: 'Low Stock Alerts', href: '/alerts', icon: AlertTriangle, managerOnly: true },
  { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight, managerOnly: false },
  { label: 'Sales Analytics', href: '/analytics', icon: TrendingUp, managerOnly: false },
  { label: 'Reorder Predictions', href: '/predictions', icon: RefreshCw, managerOnly: false },
  { label: 'Model Training', href: '/training', icon: Brain, managerOnly: true },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  isMobile?: boolean;
}

function SidebarContent({ collapsed, onCollapse, isMobile }: SidebarContentProps) {
  const { user, isManager, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const filteredItems = navigationItems.filter(item => !item.managerOnly || isManager);

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary">
          <Boxes className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-sidebar-foreground truncate">
              SmartStock
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              Inventory System
            </p>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.managerOnly && !collapsed && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-medium rounded bg-warning/20 text-warning">
                    Manager
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-sidebar-border space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'justify-center px-0'
          )}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </Button>

        <Separator className="bg-sidebar-border" />

        {/* User Info */}
        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className={cn(
              'inline-flex mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wide',
              isManager 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
            )}>
              {user.role}
            </span>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent 
          collapsed={collapsed} 
          onCollapse={() => setCollapsed(!collapsed)} 
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>
    </>
  );
}
