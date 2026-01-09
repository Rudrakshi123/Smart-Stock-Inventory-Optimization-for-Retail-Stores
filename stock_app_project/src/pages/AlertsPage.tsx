import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Package, Store, TrendingDown, Mail, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LowStockItem {
  id: string;
  productName: string;
  sku: string;
  storeName: string;
  currentStock: number;
  minStock: number;
  suggestedReorder: number;
  daysUntilStockout: number;
}

const mockLowStock: LowStockItem[] = [
  { id: '1', productName: 'Samsung TV 65"', sku: 'ELEC-002', storeName: 'Downtown Store', currentStock: 8, minStock: 10, suggestedReorder: 25, daysUntilStockout: 5 },
  { id: '2', productName: 'AirPods Pro', sku: 'ACCS-001', storeName: 'Tech Hub', currentStock: 5, minStock: 25, suggestedReorder: 50, daysUntilStockout: 2 },
  { id: '3', productName: 'Smart Thermostat', sku: 'HOME-001', storeName: 'Mall Outlet', currentStock: 3, minStock: 10, suggestedReorder: 20, daysUntilStockout: 1 },
  { id: '4', productName: 'Wireless Mouse', sku: 'ACCS-002', storeName: 'Suburban Branch', currentStock: 12, minStock: 15, suggestedReorder: 30, daysUntilStockout: 8 },
  { id: '5', productName: 'USB-C Hub', sku: 'ACCS-003', storeName: 'Downtown Store', currentStock: 7, minStock: 10, suggestedReorder: 20, daysUntilStockout: 4 },
];

export default function AlertsPage() {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(10);
  const [alerts] = useState<LowStockItem[]>(mockLowStock);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    recipientName: '',
  });

  const filteredAlerts = alerts.filter(item => item.currentStock <= threshold);

  const criticalCount = filteredAlerts.filter(a => a.daysUntilStockout <= 2).length;
  const warningCount = filteredAlerts.filter(a => a.daysUntilStockout > 2 && a.daysUntilStockout <= 5).length;

  const getSeverity = (days: number) => {
    if (days <= 2) return { label: 'Critical', color: 'destructive' as const, bgClass: 'bg-destructive/10 border-destructive/30' };
    if (days <= 5) return { label: 'Warning', color: 'warning' as const, bgClass: 'bg-warning/10 border-warning/30' };
    return { label: 'Low', color: 'secondary' as const, bgClass: 'bg-muted border-border' };
  };

  const handleSendEmailAlert = async () => {
    if (!emailForm.recipientEmail) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a recipient email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-low-stock-alert', {
        body: {
          recipientEmail: emailForm.recipientEmail,
          recipientName: emailForm.recipientName || 'Manager',
          alerts: filteredAlerts.map(alert => ({
            productName: alert.productName,
            sku: alert.sku,
            storeName: alert.storeName,
            currentStock: alert.currentStock,
            minStock: alert.minStock,
            suggestedReorder: alert.suggestedReorder,
            daysUntilStockout: alert.daysUntilStockout,
          })),
        },
      });

      if (error) throw error;

      toast({
        title: 'Email Sent Successfully',
        description: `Low stock alert sent to ${emailForm.recipientEmail}`,
      });

      setIsEmailDialogOpen(false);
      setEmailForm({ recipientEmail: '', recipientName: '' });
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: 'Failed to Send Email',
        description: error.message || 'An error occurred while sending the email',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Low Stock Alerts" 
        description="Monitor and manage inventory alerts"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="threshold" className="text-sm whitespace-nowrap">Threshold:</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              className="w-20"
            />
          </div>
          
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={filteredAlerts.length === 0} className="gap-2">
                <Mail className="h-4 w-4" />
                Send Email Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Send Low Stock Alert Email
                </DialogTitle>
                <DialogDescription>
                  Send an email notification with all current low stock alerts ({filteredAlerts.length} items)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="manager@example.com"
                    value={emailForm.recipientEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="John Smith"
                    value={emailForm.recipientName}
                    onChange={(e) => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                  />
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm font-medium mb-2">Email will include:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {criticalCount} critical alerts</li>
                    <li>• {warningCount} warning alerts</li>
                    <li>• {filteredAlerts.length - criticalCount - warningCount} low priority alerts</li>
                    <li>• Suggested reorder quantities</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmailAlert} disabled={isSending} className="gap-2">
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
                <p className="text-xs text-muted-foreground mt-1">≤ 2 days until stockout</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning Alerts</p>
                <p className="text-3xl font-bold text-warning">{warningCount}</p>
                <p className="text-xs text-muted-foreground mt-1">3-5 days until stockout</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold">{filteredAlerts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Below threshold of {threshold}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No Low Stock Alerts</p>
              <p className="text-muted-foreground">All products are above the threshold of {threshold} units</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((item, index) => {
            const severity = getSeverity(item.daysUntilStockout);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn('border transition-colors', severity.bgClass)}>
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          severity.color === 'destructive' && 'bg-destructive/20',
                          severity.color === 'warning' && 'bg-warning/20',
                          severity.color === 'secondary' && 'bg-muted'
                        )}>
                          <AlertTriangle className={cn(
                            'h-5 w-5',
                            severity.color === 'destructive' && 'text-destructive',
                            severity.color === 'warning' && 'text-warning',
                            severity.color === 'secondary' && 'text-muted-foreground'
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.productName}</h3>
                            <Badge variant={severity.color === 'warning' ? 'outline' : severity.color} className={cn(
                              severity.color === 'warning' && 'border-warning text-warning'
                            )}>
                              {severity.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{item.sku}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Store className="h-3 w-3" />
                            {item.storeName}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-bold text-lg">{item.currentStock}</p>
                        </div>
                        <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                          <p className="text-muted-foreground">Minimum</p>
                          <p className="font-bold text-lg">{item.minStock}</p>
                        </div>
                        <div className="text-center px-4 py-2 rounded-lg bg-primary/10">
                          <p className="text-muted-foreground">Suggested Order</p>
                          <p className="font-bold text-lg text-primary">{item.suggestedReorder}</p>
                        </div>
                        <div className={cn(
                          'text-center px-4 py-2 rounded-lg',
                          severity.color === 'destructive' && 'bg-destructive/20',
                          severity.color === 'warning' && 'bg-warning/20',
                          severity.color === 'secondary' && 'bg-muted'
                        )}>
                          <p className="text-muted-foreground">Days Left</p>
                          <p className={cn(
                            'font-bold text-lg',
                            severity.color === 'destructive' && 'text-destructive',
                            severity.color === 'warning' && 'text-warning'
                          )}>
                            {item.daysUntilStockout}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
