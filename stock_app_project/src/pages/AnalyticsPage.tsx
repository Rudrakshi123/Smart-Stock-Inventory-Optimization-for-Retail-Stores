import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const products = [
  { sku: 'ELEC-001', name: 'iPhone 15 Pro' },
  { sku: 'ELEC-002', name: 'Samsung TV 65"' },
  { sku: 'COMP-001', name: 'MacBook Air M3' },
  { sku: 'ACCS-001', name: 'AirPods Pro' },
  { sku: 'ELEC-003', name: 'Sony Headphones' },
];

const generateSalesData = (sku: string) => {
  const baseValue = sku === 'ELEC-001' ? 150 : sku === 'ACCS-001' ? 200 : 80;
  return [
    { month: 'Jul', sales: baseValue + Math.floor(Math.random() * 50), revenue: (baseValue + Math.floor(Math.random() * 50)) * 100 },
    { month: 'Aug', sales: baseValue + Math.floor(Math.random() * 50) + 10, revenue: (baseValue + Math.floor(Math.random() * 50) + 10) * 100 },
    { month: 'Sep', sales: baseValue + Math.floor(Math.random() * 50) + 20, revenue: (baseValue + Math.floor(Math.random() * 50) + 20) * 100 },
    { month: 'Oct', sales: baseValue + Math.floor(Math.random() * 50) + 15, revenue: (baseValue + Math.floor(Math.random() * 50) + 15) * 100 },
    { month: 'Nov', sales: baseValue + Math.floor(Math.random() * 50) + 40, revenue: (baseValue + Math.floor(Math.random() * 50) + 40) * 100 },
    { month: 'Dec', sales: baseValue + Math.floor(Math.random() * 50) + 60, revenue: (baseValue + Math.floor(Math.random() * 50) + 60) * 100 },
  ];
};

const storePerformance = [
  { store: 'Downtown', sales: 4500, target: 5000 },
  { store: 'Mall', sales: 3800, target: 4000 },
  { store: 'Suburban', sales: 2200, target: 2500 },
  { store: 'Tech Hub', sales: 3500, target: 3000 },
];

export default function AnalyticsPage() {
  const [selectedSku, setSelectedSku] = useState('ELEC-001');
  const salesData = generateSalesData(selectedSku);
  
  const selectedProduct = products.find(p => p.sku === selectedSku);
  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
  const avgSales = Math.round(totalSales / salesData.length);
  const trend = salesData[salesData.length - 1].sales - salesData[salesData.length - 2].sales;
  const trendPercent = ((trend / salesData[salesData.length - 2].sales) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <PageHeader 
        title="Sales Analytics" 
        description="Analyze sales trends and performance"
      />

      {/* Product Selector */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="space-y-2 sm:w-72">
              <Label>Select Product</Label>
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.sku} value={p.sku}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales (6 months)</p>
                <p className="text-2xl font-bold">{totalSales.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold">{avgSales.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center gap-2">
                  {trend > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-success" />
                      <span className="text-2xl font-bold text-success">+{trendPercent}%</span>
                    </>
                  ) : trend < 0 ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <span className="text-2xl font-bold text-destructive">{trendPercent}%</span>
                    </>
                  ) : (
                    <>
                      <Minus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-2xl font-bold">0%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateSalesPDF(salesData, selectedProduct?.name || 'Product', `sales-report-${selectedSku}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateSalesExcel(salesData, selectedProduct?.name || 'Product', `sales-report-${selectedSku}`)}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Trend - {selectedProduct?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--chart-2))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Performance vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs fill-muted-foreground" />
                <YAxis dataKey="store" type="category" className="text-xs fill-muted-foreground" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="Actual Sales" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted-foreground))" name="Target" radius={[0, 4, 4, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
