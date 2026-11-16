import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Подставляем токен из localStorage перед каждым запросом
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// На 401 — выкидываем на логин (кроме самого логина)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (location.pathname !== '/login') location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;