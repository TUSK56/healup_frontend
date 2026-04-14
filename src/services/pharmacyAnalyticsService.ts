import api from './apiService';

export interface PharmacyAnalytics {
  total_revenue: number;
  completed_today: number;
  orders_in_progress: number;
  new_orders: number;
  completed_total: number;
  average_order_value: number;
  revenue_last_7_days: { name: string; date: string; value: number }[];
  top_medicines: { medicine_name: string; orders: number; revenue: number }[];
  category_breakdown: { name: string; orders: number; revenue: number }[];
}

export const pharmacyAnalyticsService = {
  async get() {
    const res = await api.get<PharmacyAnalytics>('/pharmacy/analytics');
    return res.data;
  },
};
