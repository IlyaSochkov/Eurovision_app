import api from './axios';

export const getUsers = () => api.get('/admin/users');
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const getAllReviews = () => api.get('/admin/reviews');
export const deleteAnyReview = (id) => api.delete(`/admin/reviews/${id}`);