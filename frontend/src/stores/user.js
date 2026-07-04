import { defineStore } from 'pinia';
import api from '../api/api.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    // Initialise synchronously from localStorage so router guards are correct
    // on the very first navigation (before any async call completes).
    token: localStorage.getItem('token') || null,
    isAdmin: localStorage.getItem('userRole') === 'admin',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        this.setUser(response.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed',
        };
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData);
        this.setUser(response.data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Registration failed',
        };
      }
    },

    setUser(data) {
      this.token = data.token;
      this.user = data.user;
      this.isAdmin = data.user.role === 'admin';
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
    },

    // Called once on app start. State is already hydrated from localStorage;
    // this just validates the token with the server and refreshes user data.
    async checkAuth() {
      if (!this.token) return;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.data;
        this.isAdmin = this.user.role === 'admin';
        localStorage.setItem('userRole', this.user.role);
      } catch {
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    },
  },
});