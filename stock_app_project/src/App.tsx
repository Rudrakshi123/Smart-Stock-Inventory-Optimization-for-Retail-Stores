import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import StoresPage from "@/pages/StoresPage";
import StockPage from "@/pages/StockPage";
import AlertsPage from "@/pages/AlertsPage";
import TransactionsPage from "@/pages/TransactionsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PredictionsPage from "@/pages/PredictionsPage";
import TrainingPage from "@/pages/TrainingPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />

                <Route
                  path="/login"
                  element={
                    <ProtectedRoute publicOnly>
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <ProtectedRoute requireManager>
                      <ProductsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stores"
                  element={
                    <ProtectedRoute requireManager>
                      <StoresPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stock"
                  element={
                    <ProtectedRoute>
                      <StockPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute requireManager>
                      <AlertsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/predictions"
                  element={
                    <ProtectedRoute>
                      <PredictionsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/training"
                  element={
                    <ProtectedRoute requireManager>
                      <TrainingPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
