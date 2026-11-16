import api from './axios';

export const getSongs = (params) => api.get('/songs', { params });
export const getSong = (id) => api.get(`/songs/${id}`);
export const createSong = (data) => api.post('/songs', data);
export const updateSong = (id, data) => api.put(`/songs/${id}`, data);
export const deleteSong = (id) => api.delete(`/songs/${id}`);
export const uploadAudio = (formData) =>
  api.post('/songs/upload-audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });