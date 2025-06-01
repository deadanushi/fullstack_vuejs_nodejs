import axios from 'axios';

const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

if (!process.env.VUE_APP_API_URL) {
  console.error("❌ VUE_APP_API_URL is not defined in your .env file.");
}


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

export default api

