"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success("¡Bienvenido de vuelta!")
        navigate("/")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Error inesperado. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { email: "admin@hotel.com", password: "admin123", role: "Administrador" },
    { email: "reception@hotel.com", password: "reception123", role: "Recepcionista" },
    { email: "employee@hotel.com", password: "employee123", role: "Empleado" },
    { email: "cliente@hotel.com", password: "cliente123", role: "Cliente" },
  ]

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password })
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
        <p className="text-gray-600">Accede a tu cuenta del hotel</p>
      </div>

      {/* Demo Credentials */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Credenciales de Prueba:</h3>
        <div className="grid grid-cols-1 gap-2">
          {demoCredentials.map((cred, index) => (
            <button
              key={index}
              onClick={() => fillDemoCredentials(cred.email, cred.password)}
              className="text-left p-2 text-xs bg-white rounded border hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-blue-900">{cred.role}</div>
              <div className="text-blue-700">{cred.email}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
            placeholder="Tu contraseña"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full btn btn-primary py-2">
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
