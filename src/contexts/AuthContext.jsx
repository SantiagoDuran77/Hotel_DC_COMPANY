"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Demo users for testing
const demoUsers = [
  {
    id: 1,
    email: "admin@hotel.com",
    password: "admin123",
    name: "Admin Usuario",
    role: "admin",
  },
  {
    id: 2,
    email: "reception@hotel.com",
    password: "reception123",
    name: "Recepcionista",
    role: "reception",
  },
  {
    id: 3,
    email: "employee@hotel.com",
    password: "employee123",
    name: "Empleado Hotel",
    role: "employee",
  },
  {
    id: 4,
    email: "cliente@hotel.com",
    password: "cliente123",
    name: "Cliente Demo",
    role: "client",
  },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: "Credenciales inválidas" }
  }

  const register = async (userData) => {
    // Simulate registration
    const newUser = {
      id: Date.now(),
      ...userData,
      role: "client",
    }

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
