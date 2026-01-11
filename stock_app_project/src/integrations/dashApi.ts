import API from "@/integrations/api";

/* -----------------------------
   Types
-------------------------------- */
export interface DashboardSummary {
  totalProducts: number;
  activeStores: number;
  stockValue: number;
  lowStockItems: number;
}

/* -----------------------------
   Dashboard APIs
-------------------------------- */

/**
 * Fetch dashboard summary
 * Accessible by both manager and staff
 */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await API.get("/dashboard/summary/");
  return response.data;
};
