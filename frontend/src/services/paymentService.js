import api from './api';

export const createPayment = (data) => api.post('/payments/create', data);
export const getPaymentStatus = (id) => api.get(`/payments/status/${id}`);
