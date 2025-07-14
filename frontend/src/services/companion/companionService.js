import api from '../api';

// Listar todos os acompanhantes (GET /companions/)
export const listCompanions = () => api.get('/companions/');

// Deletar um acompanhante (DELETE /companions/delete/:id)
export const deleteCompanion = (id) => api.delete(`/companions/delete/${id}`);

// Atualizar dados principais (PUT /companions/update)
export const updateCompanion = (data) => api.put('/companions/update', data);

// Atualizar perfil e banner (POST /companions/profile-banner/update)
export const updateProfileAndBanner = (formData) => api.post('/companions/profile-banner/update', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Buscar perfil e banner (GET /companions/profile-banner/)
export const getProfileAndBanner = () => api.get('/companions/profile-banner/');

// Atualizar descrição (POST /companions/description/update)
export const updateDescription = (formData) => api.post('/companions/description/update', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Buscar descrição (GET /companions/description/)
export const getDescription = () => api.get('/companions/description/');

// Atualizar contato (PUT /companions/contact/update)
export const updateContact = (data) => api.put('/companions/contact/update', data);

// Buscar contato (GET /companions/contact/)
export const getContact = () => api.get('/companions/contact/');

// Atualizar serviços e preços (PUT /companions/services/update)
export const updateServices = (data) => api.put('/companions/services/update', data);

// Buscar serviços e preços (GET /companions/services/)
export const getServices = () => api.get('/companions/services/');

// Atualizar agenda semanal (PUT /companions/schedule/update)
export const updateSchedule = (data) => api.put('/companions/schedule/update', data);

// Buscar agenda semanal (GET /companions/schedule/)
export const getSchedule = () => api.get('/companions/schedule/');

// Atualizar datas indisponíveis (PUT /companions/unavailable-date/update)
export const updateUnavailableDates = (data) => api.put('/companions/unavailable-date/update', data);

// Buscar datas indisponíveis (GET /companions/unavailable-date/)
export const getUnavailableDates = () => api.get('/companions/unavailable-date/');

// Atualizar locais de atendimento (PUT /companions/locations/update)
export const updateLocations = (data) => api.put('/companions/locations/update', data);

// Buscar locais de atendimento (GET /companions/locations/)
export const getLocations = () => api.get('/companions/locations/');

// Atualizar finanças e serviços (PUT /companions/finance/update)
export const updateFinance = (data) => api.put('/companions/finance/update', data);

// Buscar finanças e serviços (GET /companions/finance/)
export const getFinance = () => api.get('/companions/finance/');