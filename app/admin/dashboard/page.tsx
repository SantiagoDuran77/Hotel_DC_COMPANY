// app/admin/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboardEnhanced } from "@/components/admin/admin-dashboard-enhanced"
import { authUtils } from "@/lib/utils/authUtils"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const user = authUtils.getUser()
      console.log('🔍 Admin dashboard page - Current user:', user)
      
      if (!user) {
        console.log('❌ No user found, redirecting to login')
        router.push("/auth/login")
        return
      }

      // Verificar si es empleado/admin
      const isEmployee = authUtils.isAdmin(user)
      console.log('👨‍💼 Is employee/admin:', isEmployee)
      
      if (!isEmployee) {
        console.log('❌ User is not employee, redirecting to client dashboard')
        router.push("/dashboard")
        return
      }

      setCurrentUser(user)
      setIsLoading(false)
    }

    // Pequeño delay para asegurar que localStorage esté actualizado
    setTimeout(checkAuth, 100)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso de administrador...</p>
          <p className="text-sm text-gray-500 mt-2">
            {currentUser ? `Usuario: ${currentUser.correo_usuario || currentUser.email}` : 'Cargando...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración - Hotel DC</h1>
              <p className="text-gray-600">
                Bienvenido, {currentUser?.nombre_empleado || currentUser?.nombre_cliente || currentUser?.nombre || 'Administrador'}
                {currentUser?.cargo_empleado && ` - ${currentUser.cargo_empleado}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {currentUser?.usuario_acceso || 'Empleado'}
              </span>
              <button 
                onClick={authUtils.logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Sistema de gestión hotelera basado en el diagrama de clases Hotel DC Company
          </p>
        </div>
        <AdminDashboardEnhanced />
      </div>
    </div>
  )
}