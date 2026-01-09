import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Store, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Boxes
} from 'lucide-react';
import { motion } from 'framer-motion';
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
} from 'recharts';

// Mock data
const salesData = [
  { name: 'Jan', sales: 4000, revenue: 24000 },
  { name: 'Feb', sales: 3000, revenue: 18000 },
  { name: 'Mar', sales: 5000, revenue: 30000 },
  { name: 'Apr', sales: 4500, revenue: 27000 },
  { name: 'May', sales: 6000, revenue: 36000 },
  { name: 'Jun', sales: 5500, revenue: 33000 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 },
  { name: 'Home', value: 12 },
  { name: 'Other', value: 8 },
];

const recentActivity = [
  { id: 1, action: 'Stock Updated', product: 'iPhone 15 Pro', change: '+50 units', time: '2 min ago' },
  { id: 2, action: 'Low Stock Alert', product: 'Samsung TV 65"', change: '3 units left', time: '15 min ago' },
  { id: 3, action: 'New Order', product: 'MacBook Air M3', change: '-5 units', time: '1 hour ago' },
  { id: 4, action: 'Restock Complete', product: 'AirPods Pro', change: '+100 units', time: '2 hours ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, isManager } = useAuth();

  return (
    <DashboardLayout>
      <PageHeader 
        title={`Welcome back, ${user?.name}`}
        description="Here's an overview of your inventory system"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={1247}
            icon={Package}
            trend={{ value: 12, label: 'from last month' }}
            variant="primary"
          />
          <StatCard
            title="Active Stores"
            value={24}
            icon={Store}
            trend={{ value: 4, label: 'new this month' }}
            variant="success"
          />
          <StatCard
            title="Stock Value"
            value="$2.4M"
            icon={DollarSign}
            trend={{ value: 8.2, label: 'from last month' }}
            variant="default"
          />
          <StatCard
            title="Low Stock Items"
            value={18}
            icon={AlertTriangle}
            trend={{ value: -5, label: 'from last week' }}
            variant="warning"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
          {/* Sales Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Sales Trend</CardTitle>
              <Badge variant="secondary" className="font-normal">
                Last 6 months
              </Badge>
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
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
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

          {/* Category Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Inventory by Category</CardTitle>
              <Badge variant="secondary" className="font-normal">
                Distribution
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" />
                    <YAxis dataKey="name" type="category" className="text-xs fill-muted-foreground" width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity & Quick Stats */}
        <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.action.includes('Alert') 
                          ? 'bg-warning' 
                          : activity.action.includes('Order') 
                            ? 'bg-destructive' 
                            : 'bg-success'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        activity.change.startsWith('+') 
                          ? 'text-success' 
                          : activity.change.startsWith('-') 
                            ? 'text-destructive' 
                            : 'text-warning'
                      }`}>
                        {activity.change}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Sales Today</span>
                </div>
                <span className="font-bold text-success">$12,450</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Items Sold</span>
                </div>
                <span className="font-bold text-primary">234</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Pending Orders</span>
                </div>
                <span className="font-bold text-warning">12</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Order Value</span>
                </div>
                <span className="font-bold">$53.20</span>
              </div>
              
              {isManager && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Manager Insights</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-sm">Monthly Target</span>
                    <span className="font-bold text-primary">78%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
