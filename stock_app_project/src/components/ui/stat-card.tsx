import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: {
    card: 'bg-card border-border',
    icon: 'bg-muted text-muted-foreground',
  },
  primary: {
    card: 'bg-primary/5 border-primary/20',
    icon: 'bg-primary/10 text-primary',
  },
  warning: {
    card: 'bg-warning/5 border-warning/20',
    icon: 'bg-warning/10 text-warning',
  },
  success: {
    card: 'bg-success/5 border-success/20',
    icon: 'bg-success/10 text-success',
  },
  destructive: {
    card: 'bg-destructive/5 border-destructive/20',
    icon: 'bg-destructive/10 text-destructive',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 transition-all duration-200 hover:shadow-lg',
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-card-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.value >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('flex items-center justify-center w-12 h-12 rounded-lg', styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
