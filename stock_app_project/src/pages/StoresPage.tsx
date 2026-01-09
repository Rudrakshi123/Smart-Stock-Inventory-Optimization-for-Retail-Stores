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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  status: 'active' | 'inactive';
  productsCount: number;
}

const mockStores: Store[] = [
  { id: '1', name: 'Downtown Store', location: 'New York, NY', address: '123 Main St', manager: 'John Smith', status: 'active', productsCount: 456 },
  { id: '2', name: 'Mall Outlet', location: 'Los Angeles, CA', address: '456 Mall Ave', manager: 'Jane Doe', status: 'active', productsCount: 328 },
  { id: '3', name: 'Suburban Branch', location: 'Chicago, IL', address: '789 Oak Rd', manager: 'Mike Johnson', status: 'active', productsCount: 215 },
  { id: '4', name: 'Airport Kiosk', location: 'Miami, FL', address: 'Terminal 3', manager: 'Sarah Wilson', status: 'inactive', productsCount: 89 },
  { id: '5', name: 'Tech Hub', location: 'San Francisco, CA', address: '101 Tech Blvd', manager: 'Alex Chen', status: 'active', productsCount: 412 },
];

export default function StoresPage() {
  const { isManager } = useAuth();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    manager: '',
  });

  const resetForm = () => {
    setFormData({ name: '', location: '', address: '', manager: '' });
    setSelectedStore(null);
  };

  const handleOpenDialog = (store?: Store) => {
    if (store) {
      setSelectedStore(store);
      setFormData({
        name: store.name,
        location: store.location,
        address: store.address,
        manager: store.manager,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.address) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (selectedStore) {
      setStores(stores.map(s => 
        s.id === selectedStore.id 
          ? { ...s, ...formData }
          : s
      ));
      toast({ title: 'Store updated successfully' });
    } else {
      const newStore: Store = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'active',
        productsCount: 0,
      };
      setStores([newStore, ...stores]);
      toast({ title: 'Store created successfully' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedStore) {
      setStores(stores.filter(s => s.id !== selectedStore.id));
      toast({ title: 'Store deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setSelectedStore(null);
  };

  const columns = [
    { key: 'name', label: 'Store Name', render: (s: Store) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">{s.name}</span>
      </div>
    )},
    { key: 'location', label: 'Location' },
    { key: 'manager', label: 'Manager' },
    { key: 'productsCount', label: 'Products', render: (s: Store) => (
      <span className="font-medium">{s.productsCount.toLocaleString()}</span>
    )},
    { key: 'status', label: 'Status', render: (s: Store) => (
      <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>
        {s.status}
      </Badge>
    )},
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Stores" 
        description="Manage your retail locations"
      >
        {isManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
                <DialogDescription>
                  {selectedStore ? 'Update the store details below.' : 'Fill in the details to add a new store.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {selectedStore ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <DataTable
        data={stores}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search stores..."
        emptyMessage="No stores found"
        actions={isManager ? (store) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(store)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                setSelectedStore(store);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedStore?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
