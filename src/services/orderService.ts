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
  /** API may send camelCase `requestId` from ASP.NET JSON. */
  request_id: number;
  requestId?: number;
  delivery?: boolean;
  /** Some responses may use PascalCase */
  Delivery?: boolean;
  delivery_fee: number;
  coupon_code?: string | null;
  coupon_percent?: number | null;
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

/** Normalize API row so `request_id` is always set (handles `requestId` camelCase). */
export function orderRequestId(order: Pick<Order, 'request_id'> & { requestId?: number }): number {
  const v = order.request_id ?? order.requestId;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const orderService = {
  async create(responseId: number, delivery: boolean = true, couponCode?: string | null, couponPercent?: number | null) {
    const res = await api.post<{ message: string; order: Order }>('/orders', {
      response_id: responseId,
      delivery,
      coupon_code: couponCode ?? null,
      coupon_percent: typeof couponPercent === 'number' ? couponPercent : null,
    });
    return res.data;
  },

  async list() {
    const res = await api.get<{ data: Order[] }>('/orders');
    const body = res.data;
    const rows = Array.isArray(body?.data) ? body.data : [];
    return {
      data: rows.map((o) => ({
        ...o,
        request_id: orderRequestId(o),
      })),
    };
  },

  /** GET /orders/{id} — order JSON at response root */
  async getById(id: number) {
    const res = await api.get<Order & { requestId?: number }>(`/orders/${id}`);
    const o = res.data;
    return { ...o, request_id: orderRequestId(o) };
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
