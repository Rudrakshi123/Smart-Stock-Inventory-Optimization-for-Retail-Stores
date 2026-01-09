import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Package, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ReorderPrediction {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  predictedDemand: number;
  suggestedReorder: number;
  reorderDate: string;
  confidence: 'high' | 'medium' | 'low';
}

const predictions: ReorderPrediction[] = [
  { id: '1', productName: 'iPhone 15 Pro', sku: 'ELEC-001', currentStock: 45, predictedDemand: 120, suggestedReorder: 100, reorderDate: '2024-01-25', confidence: 'high' },
  { id: '2', productName: 'AirPods Pro', sku: 'ACCS-001', currentStock: 5, predictedDemand: 80, suggestedReorder: 100, reorderDate: '2024-01-22', confidence: 'high' },
  { id: '3', productName: 'Samsung TV 65"', sku: 'ELEC-002', currentStock: 8, predictedDemand: 25, suggestedReorder: 30, reorderDate: '2024-01-24', confidence: 'medium' },
  { id: '4', productName: 'MacBook Air M3', sku: 'COMP-001', currentStock: 23, predictedDemand: 40, suggestedReorder: 25, reorderDate: '2024-01-28', confidence: 'medium' },
  { id: '5', productName: 'Smart Thermostat', sku: 'HOME-001', currentStock: 3, predictedDemand: 15, suggestedReorder: 20, reorderDate: '2024-01-23', confidence: 'low' },
];

const demandTrendData = [
  { week: 'W1', actual: 250, predicted: 240 },
  { week: 'W2', actual: 280, predicted: 275 },
  { week: 'W3', actual: 310, predicted: 320 },
  { week: 'W4', actual: 290, predicted: 295 },
  { week: 'W5', actual: null, predicted: 340 },
  { week: 'W6', actual: null, predicted: 360 },
];

const getConfidenceConfig = (confidence: ReorderPrediction['confidence']) => {
  switch (confidence) {
    case 'high':
      return { label: 'High Confidence', color: 'text-success', bg: 'bg-success/10' };
    case 'medium':
      return { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10' };
    case 'low':
      return { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' };
  }
};

export default function PredictionsPage() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Reorder Predictions" 
        description="AI-powered demand forecasting and reorder recommendations"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{predictions.length}</p>
                <p className="text-sm text-muted-foreground">Products to Reorder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Urgent Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">2h ago</p>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Demand Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2 }}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Actual Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-warning" style={{ borderStyle: 'dashed', borderWidth: 2 }} />
                <span className="text-sm text-muted-foreground">Predicted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Accuracy Rate</span>
                  <span className="text-sm text-success font-bold">94%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Demand Coverage</span>
                  <span className="text-sm text-primary font-bold">87%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Stockout Prevention</span>
                  <span className="text-sm text-chart-2 font-bold">91%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-2 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  The model has been trained on 12 months of historical data and updated weekly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => {
              const confidenceConfig = getConfidenceConfig(prediction.confidence);
              return (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{prediction.productName}</h3>
                        <Badge variant="outline" className={cn(confidenceConfig.bg, confidenceConfig.color, 'border-0')}>
                          {confidenceConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{prediction.sku}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="text-center px-3 py-1.5 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="font-bold">{prediction.currentStock}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <div className="text-center px-3 py-1.5 rounded bg-warning/10">
                      <p className="text-xs text-muted-foreground">Predicted Demand</p>
                      <p className="font-bold text-warning">{prediction.predictedDemand}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <div className="text-center px-3 py-1.5 rounded bg-primary/10">
                      <p className="text-xs text-muted-foreground">Suggested Order</p>
                      <p className="font-bold text-primary">{prediction.suggestedReorder}</p>
                    </div>
                    <div className="text-center px-3 py-1.5 rounded bg-muted">
                      <p className="text-xs text-muted-foreground">Order By</p>
                      <p className="font-medium text-sm">{prediction.reorderDate}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
