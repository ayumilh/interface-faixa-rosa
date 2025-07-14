import api from './api';

export const reportUser = (data) => api.post('/denuncias', data);
