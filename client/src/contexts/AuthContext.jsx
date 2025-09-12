"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authAPI } from "../services/api"
import { useToast } from "./ToastContext"

const AuthContext = createContext()

// Estados de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { showToast } = useToast()

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          const response = await authAPI.verifyToken()
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data.user,
              token,
            },
          })
        } catch (error) {
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Función de login
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authAPI.login(credentials)
      const { user, tokens } = response.data

      // Guardar tokens en localStorage
      localStorage.setItem("token", tokens.accessToken)
      localStorage.setItem("refreshToken", tokens.refreshToken)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          token: tokens.accessToken,
        },
      })

      showToast("Inicio de sesión exitoso", "success")
      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al iniciar sesión"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      showToast(errorMessage, "error")
      return { success: false, error: errorMessage }
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      const response = await authAPI.register(userData)
      const { user, tokens } = response.data

      // Guardar tokens en localStorage
      localStorage.setItem("token", tokens.accessToken)
      localStorage.setItem("refreshToken", tokens.refreshToken)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          token: tokens.accessToken,
        },
      })

      showToast("Registro exitoso", "success")
      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al registrarse"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      showToast(errorMessage, "error")
      return { success: false, error: errorMessage }
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      dispatch({ type: "LOGOUT" })
      showToast("Sesión cerrada", "info")
    }
  }

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      dispatch({ type: "UPDATE_USER", payload: response.data.user })
      showToast("Perfil actualizado exitosamente", "success")
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al actualizar perfil"
      showToast(errorMessage, "error")
      return { success: false, error: errorMessage }
    }
  }

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData)
      showToast("Contraseña actualizada exitosamente", "success")
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al cambiar contraseña"
      showToast(errorMessage, "error")
      return { success: false, error: errorMessage }
    }
  }

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return state.user?.role === role
  }

  // Verificar si el usuario tiene alguno de los roles especificados
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role)
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}
