import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  description: string;
  createdAt: string;
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', sku: 'ELEC-001', name: 'iPhone 15 Pro', category: 'Electronics', price: 1199, description: 'Latest Apple smartphone', createdAt: '2024-01-15' },
  { id: '2', sku: 'ELEC-002', name: 'Samsung TV 65"', category: 'Electronics', price: 899, description: '4K Smart TV', createdAt: '2024-01-10' },
  { id: '3', sku: 'COMP-001', name: 'MacBook Air M3', category: 'Computers', price: 1299, description: 'Apple laptop with M3 chip', createdAt: '2024-01-08' },
  { id: '4', sku: 'ACCS-001', name: 'AirPods Pro', category: 'Accessories', price: 249, description: 'Wireless earbuds', createdAt: '2024-01-05' },
  { id: '5', sku: 'HOME-001', name: 'Smart Thermostat', category: 'Home', price: 199, description: 'WiFi enabled thermostat', createdAt: '2024-01-02' },
  { id: '6', sku: 'ELEC-003', name: 'Sony Headphones', category: 'Electronics', price: 349, description: 'Noise cancelling headphones', createdAt: '2024-01-01' },
];

export default function ProductsPage() {
  const { isManager } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ sku: '', name: '', category: '', price: '', description: '' });
    setSelectedProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.sku || !formData.name || !formData.category || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (selectedProduct) {
      // Update
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...formData, price: parseFloat(formData.price) }
          : p
      ));
      toast({ title: 'Product updated successfully' });
    } else {
      // Create
      const newProduct: Product = {
        id: crypto.randomUUID(),
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts([newProduct, ...products]);
      toast({ title: 'Product created successfully' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      toast({ title: 'Product deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const columns = [
    { key: 'sku', label: 'SKU', className: 'font-mono text-sm' },
    { key: 'name', label: 'Product Name', render: (p: Product) => (
      <span className="font-medium">{p.name}</span>
    )},
    { key: 'category', label: 'Category', render: (p: Product) => (
      <Badge variant="secondary">{p.category}</Badge>
    )},
    { key: 'price', label: 'Price', render: (p: Product) => (
      <span className="font-medium">${p.price.toLocaleString()}</span>
    )},
    { key: 'createdAt', label: 'Created' },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Products" 
        description="Manage your product catalog"
      >
        {isManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {selectedProduct ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g., ELEC-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Electronics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {selectedProduct ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search products..."
        emptyMessage="No products found"
        actions={isManager ? (product) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                setSelectedProduct(product);
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
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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
