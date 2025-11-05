// lib/utils/authUtils.ts
const API_BASE_URL = 'http://localhost:5000/api';

export const authUtils = {
  // Login real con backend - CON DEBUG
  async login(email: string, password: string) {
    try {
      console.log('🔄 Attempting login with:', { email, password: password.substring(0, 4) })
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ Login error:', errorData)
        throw new Error(errorData.error || 'Credenciales incorrectas')
      }

      const data = await response.json()
      console.log('✅ Login success:', data)

      // Guardar en localStorage
      localStorage.setItem('accessToken', data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      console.log('💾 Saved to localStorage:', {
        accessToken: data.tokens.accessToken ? 'YES' : 'NO',
        user: data.user ? 'YES' : 'NO'
      })
      
      return data.user
    } catch (error) {
      console.error('🔥 Login error:', error)
      throw error
    }
  },

  // Registro real con backend
  async register(userData: any) {
    try {
      console.log('🔄 Attempting register with:', userData)
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Register response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ Register error:', errorData)
        throw new Error(errorData.error || 'Error en el registro')
      }

      const data = await response.json()
      console.log('✅ Register success:', data)
      
      return data
    } catch (error) {
      console.error('🔥 Register error:', error)
      throw error
    }
  },

  // Obtener ruta del dashboard según rol
  getDashboardRoute(user: any) {
    console.log('🎯 Getting dashboard route for user:', user)
    
    const route = user.role === 'Empleado' ? '/admin' : '/dashboard'
    console.log('🔄 Redirecting to:', route)
    return route
  },

  // Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('accessToken')
    const isAuth = !!token
    console.log('🔐 Authentication check:', isAuth)
    return isAuth
  },

  // Cerrar sesión
  logout() {
    console.log('🚪 Logging out...')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/auth/login'
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('accessToken')
  },

  // Obtener usuario
  getUser() {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    console.log('👤 Getting user from storage:', user)
    return user
  }
};