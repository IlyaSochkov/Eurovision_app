import api from './axios';

export const getPlaylists = () => api.get('/playlists');
export const getPlaylist = (id) => api.get(`/playlists/${id}`);
export const createPlaylist = (data) => api.post('/playlists', data);
export const updatePlaylist = (id, data) => api.put(`/playlists/${id}`, data);
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`);
export const addSongToPlaylist = (playlistId, songId) =>
  api.post(`/playlists/${playlistId}/songs`, { song_id: songId });
export const removeSongFromPlaylist = (playlistId, songId) =>
  api.delete(`/playlists/${playlistId}/songs/${songId}`);