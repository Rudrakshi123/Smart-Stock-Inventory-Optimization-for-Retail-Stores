import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Package,
  Store,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Boxes,
} from "lucide-react";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

/* -----------------------------
   Types
-------------------------------- */
interface DashboardSummary {
  totalProducts: number;
  activeStores: number;
  stockValue: number;
  lowStockItems: number;
}

/* -----------------------------
   Animations
-------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* -----------------------------
   Mock fallback data
   (used until backend is ready)
-------------------------------- */
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 20 },
  { name: "Home", value: 12 },
  { name: "Other", value: 8 },
];

/* =============================
   Dashboard Page
============================= */
export default function DashboardPage() {
  const { user, isManager, token } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState(false);

  /* -----------------------------
     API Call (Django REST)
  -------------------------------- */
  useEffect(() => {
    async function getDashboardSummary() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard/summary/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load dashboard");

        const data = await response.json();
        setSummary(data);
      } catch {
        setError(true);
      }
    }

    getDashboardSummary();
  }, [token]);

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${user?.name ?? "User"}`}
        description="Here’s an overview of your inventory system"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* =============================
           Stats Grid
        ============================== */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Products"
            value={summary?.totalProducts ?? 1247}
            icon={Package}
            variant="primary"
          />
          <StatCard
            title="Active Stores"
            value={summary?.activeStores ?? 24}
            icon={Store}
            variant="success"
          />
          <StatCard
            title="Stock Value"
            value={`$${summary?.stockValue ?? "2.4M"}`}
            icon={DollarSign}
          />
          <StatCard
            title="Low Stock Items"
            value={summary?.lowStockItems ?? 18}
            icon={AlertTriangle}
            variant="warning"
          />
        </motion.div>

        {/* =============================
           Charts
        ============================== */}
        <motion.div
          variants={itemVariants}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Sales Trend */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Sales Trend</CardTitle>
              <Badge variant="secondary">Last 6 months</Badge>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* =============================
           Quick Stats
        ============================== */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <ArrowUpRight className="text-success h-4 w-4" />
                  Sales Today
                </span>
                <strong>$12,450</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Boxes className="text-primary h-4 w-4" />
                  Items Sold
                </span>
                <strong>234</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Avg Order Value
                </span>
                <strong>$53.20</strong>
              </div>

              {isManager && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">
                    Manager Insight
                  </p>
                  <strong className="text-primary">Monthly Target: 78%</strong>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {error && (
          <p className="text-sm text-destructive">
            Failed to load dashboard data. Showing cached values.
          </p>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
