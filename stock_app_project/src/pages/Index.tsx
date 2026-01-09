import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Boxes, ArrowRight, BarChart3, Package, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container max-w-6xl mx-auto px-4 py-20 lg:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg">
                <Boxes className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Smart Stock
              <span className="text-primary block mt-2">Inventory Optimization</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AI-powered inventory management system for retail stores. 
              Predict demand, optimize stock levels, and never miss a sale.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="gap-2 px-8">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to manage inventory
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From real-time tracking to AI-powered predictions, we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Package,
              title: 'Real-time Tracking',
              description: 'Monitor stock levels across all stores in real-time with instant low-stock alerts.',
            },
            {
              icon: BarChart3,
              title: 'Smart Analytics',
              description: 'Visualize sales trends, identify patterns, and make data-driven decisions.',
            },
            {
              icon: Shield,
              title: 'Demand Prediction',
              description: 'AI-powered forecasting to predict demand and optimize reorder timing.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Boxes className="h-5 w-5 text-primary" />
            <span className="font-semibold">SmartStock</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Stock Inventory Optimization System
          </p>
        </div>
      </footer>
    </div>
  );
}
