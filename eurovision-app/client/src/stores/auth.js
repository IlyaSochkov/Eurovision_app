import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as authApi from '../api/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => Boolean(token.value));
  const isAdmin = computed(() => user.value?.role === 'admin');

  function setSession(payload) {
    token.value = payload.token;
    user.value = payload.user;
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
  }

  async function login(credentials) {
    const { data } = await authApi.login(credentials);
    setSession(data);
  }

  async function register(payload) {
    const { data } = await authApi.register(payload);
    setSession(data);
  }

  async function refreshMe() {
    const { data } = await authApi.getMe();
    user.value = data;
    localStorage.setItem('user', JSON.stringify(data));
  }

  async function updateProfile(payload) {
    const { data } = await authApi.updateMe(payload);
    user.value = data;
    localStorage.setItem('user', JSON.stringify(data));
  }

  async function deleteProfile() {
    await authApi.deleteMe();
    logout();
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    token, user, isAuthenticated, isAdmin,
    login, register, refreshMe, updateProfile, deleteProfile, logout,
  };
});