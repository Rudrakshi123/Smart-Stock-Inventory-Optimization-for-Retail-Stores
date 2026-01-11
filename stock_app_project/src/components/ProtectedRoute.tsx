import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
  publicOnly?: boolean;
}

export function ProtectedRoute({
  children,
  requireManager = false,
  publicOnly = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait until auth state is resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Public-only route (login page)
  if (publicOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Protected routes
  if (!publicOnly && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 4. Role check (future-safe)
  if (requireManager) {
    // Add role check here once role exists in AuthContext
    return <>{children}</>;
  }

  return <>{children}</>;
}
