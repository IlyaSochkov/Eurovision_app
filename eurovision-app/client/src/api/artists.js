import api from './axios';

export const getArtists = () => api.get('/artists');
export const getArtist = (id) => api.get(`/artists/${id}`);
export const createArtist = (data) => api.post('/artists', data);
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);