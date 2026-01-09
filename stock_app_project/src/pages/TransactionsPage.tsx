import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'sale' | 'restock' | 'transfer' | 'adjustment';
  productName: string;
  sku: string;
  quantity: number;
  storeName: string;
  date: string;
  user: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'sale', productName: 'iPhone 15 Pro', sku: 'ELEC-001', quantity: -5, storeName: 'Downtown Store', date: '2024-01-20 14:30', user: 'John Smith' },
  { id: '2', type: 'restock', productName: 'AirPods Pro', sku: 'ACCS-001', quantity: 100, storeName: 'Tech Hub', date: '2024-01-20 11:15', user: 'Jane Doe' },
  { id: '3', type: 'sale', productName: 'MacBook Air M3', sku: 'COMP-001', quantity: -3, storeName: 'Mall Outlet', date: '2024-01-19 16:45', user: 'Mike Johnson' },
  { id: '4', type: 'transfer', productName: 'Samsung TV 65"', sku: 'ELEC-002', quantity: -10, storeName: 'Downtown Store', date: '2024-01-19 10:00', user: 'Sarah Wilson' },
  { id: '5', type: 'adjustment', productName: 'Smart Thermostat', sku: 'HOME-001', quantity: -2, storeName: 'Mall Outlet', date: '2024-01-18 09:30', user: 'Alex Chen' },
  { id: '6', type: 'sale', productName: 'Sony Headphones', sku: 'ELEC-003', quantity: -8, storeName: 'Suburban Branch', date: '2024-01-17 15:20', user: 'John Smith' },
];

const products = [
  { sku: 'ELEC-001', name: 'iPhone 15 Pro' },
  { sku: 'ELEC-002', name: 'Samsung TV 65"' },
  { sku: 'COMP-001', name: 'MacBook Air M3' },
  { sku: 'ACCS-001', name: 'AirPods Pro' },
];

const stores = ['Downtown Store', 'Mall Outlet', 'Suburban Branch', 'Tech Hub'];

export default function TransactionsPage() {
  const { isManager, user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sale' as Transaction['type'],
    productSku: '',
    quantity: '',
    storeName: '',
  });

  const handleSubmit = () => {
    if (!formData.productSku || !formData.quantity || !formData.storeName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const product = products.find(p => p.sku === formData.productSku);
    const quantity = parseInt(formData.quantity);
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: formData.type,
      productName: product?.name || '',
      sku: formData.productSku,
      quantity: formData.type === 'sale' ? -Math.abs(quantity) : Math.abs(quantity),
      storeName: formData.storeName,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: user?.name || 'Unknown',
    };

    setTransactions([newTransaction, ...transactions]);
    toast({ title: 'Transaction recorded successfully' });
    setIsDialogOpen(false);
    setFormData({ type: 'sale', productSku: '', quantity: '', storeName: '' });
  };

  const getTypeConfig = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return { label: 'Sale', variant: 'default' as const, icon: ArrowUpRight };
      case 'restock':
        return { label: 'Restock', variant: 'secondary' as const, icon: ArrowDownLeft };
      case 'transfer':
        return { label: 'Transfer', variant: 'outline' as const, icon: ArrowUpRight };
      case 'adjustment':
        return { label: 'Adjustment', variant: 'outline' as const, icon: ArrowUpRight };
    }
  };

  const columns = [
    { key: 'date', label: 'Date', className: 'whitespace-nowrap' },
    { key: 'type', label: 'Type', render: (t: Transaction) => {
      const config = getTypeConfig(t.type);
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }},
    { key: 'productName', label: 'Product', render: (t: Transaction) => (
      <div>
        <p className="font-medium">{t.productName}</p>
        <p className="text-sm text-muted-foreground font-mono">{t.sku}</p>
      </div>
    )},
    { key: 'quantity', label: 'Quantity', render: (t: Transaction) => (
      <span className={cn(
        'font-bold',
        t.quantity > 0 ? 'text-success' : 'text-destructive'
      )}>
        {t.quantity > 0 ? '+' : ''}{t.quantity}
      </span>
    )},
    { key: 'storeName', label: 'Store' },
    { key: 'user', label: 'Recorded By' },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Transactions" 
        description="View and record inventory transactions"
      >
        {isManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>
                  Add a new inventory transaction record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: Transaction['type']) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select 
                    value={formData.productSku} 
                    onValueChange={(value) => setFormData({ ...formData, productSku: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.sku} value={p.sku}>
                          {p.name} ({p.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Store</Label>
                  <Select 
                    value={formData.storeName} 
                    onValueChange={(value) => setFormData({ ...formData, storeName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(store => (
                        <SelectItem key={store} value={store}>{store}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Record Transaction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <DataTable
        data={transactions}
        columns={columns}
        searchKey="productName"
        searchPlaceholder="Search transactions..."
        emptyMessage="No transactions found"
      />
    </DashboardLayout>
  );
}
