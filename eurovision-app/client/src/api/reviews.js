import api from './axios';

export const getReviewsForSong = (songId) => api.get(`/reviews/song/${songId}`);
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);