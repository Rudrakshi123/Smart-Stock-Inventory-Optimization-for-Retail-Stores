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
import { Plus, Pencil, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  storeName: string;
  quantity: number;
  minQuantity: number;
  lastUpdated: string;
}

const mockStock: StockItem[] = [
  { id: '1', productName: 'iPhone 15 Pro', sku: 'ELEC-001', storeName: 'Downtown Store', quantity: 45, minQuantity: 20, lastUpdated: '2024-01-20' },
  { id: '2', productName: 'Samsung TV 65"', sku: 'ELEC-002', storeName: 'Downtown Store', quantity: 8, minQuantity: 10, lastUpdated: '2024-01-19' },
  { id: '3', productName: 'MacBook Air M3', sku: 'COMP-001', storeName: 'Mall Outlet', quantity: 23, minQuantity: 15, lastUpdated: '2024-01-18' },
  { id: '4', productName: 'AirPods Pro', sku: 'ACCS-001', storeName: 'Tech Hub', quantity: 5, minQuantity: 25, lastUpdated: '2024-01-17' },
  { id: '5', productName: 'Sony Headphones', sku: 'ELEC-003', storeName: 'Suburban Branch', quantity: 67, minQuantity: 20, lastUpdated: '2024-01-16' },
  { id: '6', productName: 'Smart Thermostat', sku: 'HOME-001', storeName: 'Mall Outlet', quantity: 3, minQuantity: 10, lastUpdated: '2024-01-15' },
];

const stores = ['All Stores', 'Downtown Store', 'Mall Outlet', 'Suburban Branch', 'Tech Hub'];

export default function StockPage() {
  const { isManager } = useAuth();
  const { toast } = useToast();
  const [stock, setStock] = useState<StockItem[]>(mockStock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [storeFilter, setStoreFilter] = useState('All Stores');
  const [formData, setFormData] = useState({
    quantity: '',
    minQuantity: '',
  });

  const filteredStock = storeFilter === 'All Stores' 
    ? stock 
    : stock.filter(item => item.storeName === storeFilter);

  const handleOpenDialog = (item: StockItem) => {
    setSelectedItem(item);
    setFormData({
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.quantity || !formData.minQuantity) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (selectedItem) {
      setStock(stock.map(s => 
        s.id === selectedItem.id 
          ? { 
              ...s, 
              quantity: parseInt(formData.quantity), 
              minQuantity: parseInt(formData.minQuantity),
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : s
      ));
      toast({ title: 'Stock updated successfully' });
    }

    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const getStockStatus = (item: StockItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (item.quantity < item.minQuantity) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const columns = [
    { key: 'productName', label: 'Product', render: (s: StockItem) => (
      <div>
        <p className="font-medium">{s.productName}</p>
        <p className="text-sm text-muted-foreground font-mono">{s.sku}</p>
      </div>
    )},
    { key: 'storeName', label: 'Store' },
    { key: 'quantity', label: 'Quantity', render: (s: StockItem) => {
      const status = getStockStatus(s);
      return (
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-bold',
            s.quantity < s.minQuantity ? 'text-warning' : '',
            s.quantity === 0 ? 'text-destructive' : ''
          )}>
            {s.quantity}
          </span>
          {s.quantity < s.minQuantity && (
            <AlertTriangle className="h-4 w-4 text-warning" />
          )}
        </div>
      );
    }},
    { key: 'minQuantity', label: 'Min. Qty' },
    { key: 'status', label: 'Status', render: (s: StockItem) => {
      const status = getStockStatus(s);
      return (
        <Badge variant={status.variant === 'warning' ? 'outline' : status.variant} className={cn(
          status.variant === 'warning' && 'border-warning text-warning bg-warning/10'
        )}>
          {status.label}
        </Badge>
      );
    }},
    { key: 'lastUpdated', label: 'Last Updated' },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Stock Management" 
        description="Monitor and update inventory levels"
      >
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map(store => (
              <SelectItem key={store} value={store}>{store}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <DataTable
        data={filteredStock}
        columns={columns}
        searchKey="productName"
        searchPlaceholder="Search products..."
        emptyMessage="No stock items found"
        actions={isManager ? (item) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : undefined}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update stock levels for {selectedItem?.productName} at {selectedItem?.storeName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Current Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum Quantity (Alert Threshold)</Label>
              <Input
                id="minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                placeholder="Enter minimum quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
