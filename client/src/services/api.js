import axios from "axios"

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token de autorización
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si el token expiró, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data.tokens
          localStorage.setItem("token", accessToken)
          localStorage.setItem("refreshToken", newRefreshToken)

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Si no se puede renovar el token, cerrar sesión
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API de autenticación
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  verifyToken: () => api.get("/auth/verify"),
  changePassword: (passwordData) => api.post("/auth/change-password", passwordData),
  refreshToken: (refreshToken) => api.post("/auth/refresh-token", { refreshToken }),
}

// API de habitaciones
export const roomsAPI = {
  getAll: (params = {}) => api.get("/rooms", { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post("/rooms", roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`),
  checkAvailability: (params) => api.get("/rooms/availability", { params }),
}

// API de reservas
export const reservationsAPI = {
  getAll: (params = {}) => api.get("/reservations", { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (reservationData) => api.post("/reservations", reservationData),
  update: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  cancel: (id) => api.patch(`/reservations/${id}/cancel`),
  confirm: (id) => api.patch(`/reservations/${id}/confirm`),
  getUserReservations: (userId) => api.get(`/reservations/user/${userId}`),
}

// API de servicios
export const servicesAPI = {
  getAll: (params = {}) => api.get("/services", { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post("/services", serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
}

// API de usuarios
export const usersAPI = {
  getAll: (params = {}) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
}

// API de pagos
export const paymentsAPI = {
  getAll: (params = {}) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post("/payments", paymentData),
  processPayment: (paymentData) => api.post("/payments/process", paymentData),
}

// API de dashboard
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getAdminStats: () => api.get("/dashboard/admin-stats"),
  getReceptionStats: () => api.get("/dashboard/reception-stats"),
  getEmployeeStats: () => api.get("/dashboard/employee-stats"),
  getRecentActivity: () => api.get("/dashboard/recent-activity"),
  getNotifications: () => api.get("/dashboard/notifications"),
}

export default api
