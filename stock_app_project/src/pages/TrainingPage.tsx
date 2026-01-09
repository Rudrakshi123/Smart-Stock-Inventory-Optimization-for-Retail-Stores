import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, RefreshCw, CheckCircle, Clock, Zap, TrendingUp, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrainingHistory {
  id: string;
  date: string;
  duration: string;
  accuracy: number;
  status: 'completed' | 'failed';
  dataPoints: number;
}

const trainingHistory: TrainingHistory[] = [
  { id: '1', date: '2024-01-20 14:30', duration: '45 min', accuracy: 94.2, status: 'completed', dataPoints: 125000 },
  { id: '2', date: '2024-01-13 10:15', duration: '42 min', accuracy: 93.8, status: 'completed', dataPoints: 118000 },
  { id: '3', date: '2024-01-06 09:00', duration: '48 min', accuracy: 92.5, status: 'completed', dataPoints: 112000 },
  { id: '4', date: '2023-12-30 11:30', duration: '38 min', accuracy: 91.2, status: 'completed', dataPoints: 105000 },
];

export default function TrainingPage() {
  const { toast } = useToast();
  const [isTraining, setIsTraining] = useState(false);

  const handleRetrain = async () => {
    setIsTraining(true);
    toast({
      title: 'Model Training Started',
      description: 'This may take several minutes. You can continue using the app.',
    });

    // Simulate training
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsTraining(false);
    toast({
      title: 'Training Complete',
      description: 'Model has been updated with 95.1% accuracy.',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Model Training" 
        description="Manage and retrain the demand prediction model"
      />

      {/* Model Status */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Current Model Status
            </CardTitle>
            <CardDescription>
              Demand prediction model trained on historical sales data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-xl font-bold text-success">Active</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Accuracy</span>
                </div>
                <p className="text-xl font-bold text-primary">94.2%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Trained</span>
                </div>
                <p className="text-xl font-bold">7 days ago</p>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data Points</span>
                </div>
                <p className="text-xl font-bold">125K</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="font-medium">Ready for Retraining</p>
                <p className="text-sm text-muted-foreground">
                  New sales data available. Retraining may improve predictions.
                </p>
              </div>
              <Button 
                onClick={handleRetrain} 
                disabled={isTraining}
                className="gap-2"
              >
                {isTraining ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Retrain Model
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Algorithm</span>
              <Badge variant="secondary">XGBoost</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Features</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Training Data</span>
              <span className="font-medium">12 months</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Update Frequency</span>
              <span className="font-medium">Weekly</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge>v2.4.1</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training History</CardTitle>
          <CardDescription>Previous model training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingHistory.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.status === 'completed' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    {session.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <RefreshCw className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{session.date}</p>
                    <p className="text-sm text-muted-foreground">Duration: {session.duration}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="text-center px-3 py-1.5 rounded bg-primary/10">
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="font-bold text-primary">{session.accuracy}%</p>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded bg-muted">
                    <p className="text-xs text-muted-foreground">Data Points</p>
                    <p className="font-bold">{(session.dataPoints / 1000).toFixed(0)}K</p>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'default' : 'destructive'}>
                    {session.status === 'completed' ? 'Completed' : 'Failed'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
