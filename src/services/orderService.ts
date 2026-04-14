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
  delivery: boolean;
  delivery_fee: number;
  total_price: number;
  status: string;
  created_at: string;
  pharmacy?: { id: number; name: string };
  patient?: { id: number; name: string };
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

  async getById(orderId: number) {
    const res = await api.get<Order>(`/orders/${orderId}`);
    return res.data;
  },

  async updateStatus(orderId: number, status: string) {
    const res = await api.patch<{ message: string; order: Order }>('/orders/status', { order_id: orderId, status });
    return res.data;
  },

  async patientConfirm(orderId: number) {
    const res = await api.patch<{ message: string; order: Order }>(`/orders/${orderId}/patient-confirm`);
    return res.data;
  },
};
