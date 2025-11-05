// lib/utils/authUtils.ts
const API_BASE_URL = 'http://localhost:5000/api';

export const authUtils = {
  // Login real con backend
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      
      // Guardar en localStorage
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Registro real con backend
  async register(userData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Obtener ruta del dashboard según rol
  getDashboardRoute(user: any) {
    switch (user.role) {
      case 'admin':
      case 'Administrador':
        return '/admin';
      case 'empleado':
      case 'Empleado':
      case 'Recepción':
        return '/employee';
      case 'cliente':
      case 'Cliente':
      default:
        return '/dashboard';
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('accessToken');
  },

  // Obtener usuario
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};