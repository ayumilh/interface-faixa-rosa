import api from './api';

export const searchCompanions = (params) => api.get('/search', { params });
