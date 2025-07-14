import api from './api';

export const getAllPlans = () => api.get('/plans');
export const subscribePlan = (planId) => api.post(`/plans/subscribe/${planId}`);
