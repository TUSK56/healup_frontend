import api from './apiService';

export interface OrderItem {
  id: number;
  medicine_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  patient_id: number;
  pharmacy_id: number;
  request_id: number;
  delivery?: boolean;
  /** Some responses may use PascalCase */
  Delivery?: boolean;
  delivery_fee: number;
  total_price: number;
  status: string;
  created_at: string;
  preparing_at?: string | null;
  payment_method?: string | null;
  delivery_address_snapshot?: string | null;
  pharmacy?: {
    id: number;
    name: string;
    city?: string | null;
    district?: string | null;
    address_details?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  patient?: {
    id: number;
    name: string;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  items?: OrderItem[];
}

export const orderService = {
  async create(responseId: number, delivery: boolean = true) {
    const res = await api.post<{ message: string; order: Order }>('/orders', { response_id: responseId, delivery });
    return res.data;
  },

  async list() {
    const res = await api.get<{ data: Order[] }>('/orders');
    return res.data;
  },

  /** GET /orders/{id} — order JSON at response root */
  async getById(id: number) {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  async updateStatus(orderId: number, status: string) {
    const res = await api.patch<{ message: string; order: Order }>('/orders/status', { order_id: orderId, status });
    return res.data;
  },

  /** Patient marks order delivered after courier reaches destination (demo / simulation). */
  async patientMarkDelivered(orderId: number) {
    const res = await api.patch<{ message: string; order: Order }>(`/orders/${orderId}/patient-mark-delivered`);
    return res.data;
  },
};
