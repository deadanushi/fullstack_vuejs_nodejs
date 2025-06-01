import { defineStore } from 'pinia';
import api from '../api/api.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isAdmin: false,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        this.setUser(response.data);
        console.log(response.data)
        if(response.data.user.role == "admin"){
          this.isAdmin = true
        }
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed' 
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
          message: error.response?.data?.message || 'Registration failed' 
        };
      }
    },
    
    setUser(data) {
      this.token = data.token;
      this.user = data.user;
      this.isAdmin = data.user.role === 'admin';
      
      localStorage.setItem('token', data.token);
    },
    
    checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        
        this.fetchUserData();
      }
    },
    
    async fetchUserData() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.data;
        this.isAdmin = this.user.role === 'admin';
      } catch (error) {
        this.logout();
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isAdmin = false;
      localStorage.removeItem('token');
    }
  }
});