// lib/utils/authUtils.ts
const API_BASE_URL = 'http://localhost:5000/api';

// Función segura para localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
}

const removeLocalStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

export const authUtils = {
  // Login real con backend
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
      console.log('✅ Login success - Full response:', data)

      // Guardar en localStorage de forma segura
      if (data.tokens) {
        setLocalStorageItem('accessToken', data.tokens.accessToken)
        setLocalStorageItem('refreshToken', data.tokens.refreshToken)
        setLocalStorageItem('user', JSON.stringify(data.user))
      }

      console.log('💾 Saved user to localStorage:', data.user)
      
      return data.user
    } catch (error) {
      console.error('🔥 Login error:', error)
      throw error
    }
  },

  // Obtener ruta del dashboard según rol
  getDashboardRoute(user: any) {
    console.log('🎯 Getting dashboard route for user:', user)
    
    // Verificar diferentes formas en que puede venir el rol
    let userRole = '';
    
    if (user?.usuario_acceso === 'Empleado') {
      userRole = 'admin';
    } else if (user?.role === 'Empleado') {
      userRole = 'admin';
    } else if (user?.cargo_empleado) {
      userRole = 'admin';
    } else if (user?.usuario_acceso === 'Cliente' || user?.role === 'Cliente') {
      userRole = 'client';
    } else {
      userRole = 'client';
    }

    console.log('🔍 Detected user role:', userRole)
    
    const route = userRole === 'admin' ? '/admin' : '/dashboard'
    console.log('🔄 Redirecting to:', route)
    return route
  },

  // Verificar si es admin
  isAdmin(user: any) {
    if (!user) return false;
    
    return (
      user?.usuario_acceso === 'Empleado' ||
      user?.role === 'Empleado' ||
      user?.cargo_empleado !== undefined
    );
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = getLocalStorageItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    console.log('👤 Getting current user from storage:', user)
    return user
  },

  // Verificar acceso de admin
  hasAdminAccess(user: any) {
    return this.isAdmin(user);
  },

  // Registro real con backend
  async register(userData: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    nacionalidad: string;
  }) {
    try {
      console.log('🔄 Attempting register with:', { 
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        tiene_password: !!userData.password
      })

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_cliente: userData.nombre,
          apellido_cliente: userData.apellido,
          correo_cliente: userData.email,
          telefono_cliente: userData.telefono,
          direccion_cliente: userData.direccion,
          nacionalidad: userData.nacionalidad,
          contraseña_usuario: userData.password
        }),
      });

      console.log('📡 Registration response status:', response.status)
      
      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.log('❌ Server error details:', errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (parseError) {
          console.log('❌ Could not parse error response');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Registration successful:', result);
      
      return {
        ...result,
        message: 'Cuenta creada exitosamente'
      };
      
    } catch (error) {
      console.error('🔥 Register error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Connection refused')) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5000');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Error de red. Verifica tu conexión a internet.');
      } else {
        throw error;
      }
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    const token = getLocalStorageItem('accessToken')
    const isAuth = !!token
    console.log('🔐 Authentication check:', isAuth)
    return isAuth
  },

  // Cerrar sesión
  logout() {
    console.log('🚪 Logging out...')
    removeLocalStorageItem('accessToken')
    removeLocalStorageItem('refreshToken')
    removeLocalStorageItem('user')
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  },

  // Obtener token
  getToken() {
    return getLocalStorageItem('accessToken')
  },

  // Obtener usuario
  getUser() {
    return this.getCurrentUser()
  }
};