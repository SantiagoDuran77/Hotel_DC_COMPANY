// components/dashboard/AdminDashboard.tsx
"use client"

import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Calendar, DollarSign, BarChart3, Settings, Bell, Shield } from "lucide-react"

const AdminDashboard = () => {
  const { user, logout } = useAuth()

  const stats = [
    { 
      name: "Habitaciones Ocupadas", 
      value: "24/30", 
      percentage: "80%",
      icon: Building, 
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      name: "Ingresos del Mes", 
      value: "$125,430", 
      percentage: "+12%",
      icon: DollarSign, 
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      name: "Huéspedes Activos", 
      value: "156", 
      percentage: "+8%",
      icon: Users, 
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      name: "Satisfacción", 
      value: "4.8/5", 
      percentage: "96%",
      icon: BarChart3, 
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
  ]

  const recentBookings = [
    { id: 1001, guest: "María González", room: "Suite Presidencial", checkIn: "2024-01-15", checkOut: "2024-01-18", status: "Activa" },
    { id: 1002, guest: "Carlos Rodríguez", room: "Habitación Doble", checkIn: "2024-01-14", checkOut: "2024-01-16", status: "Activa" },
    { id: 1003, guest: "Ana Martínez", room: "Habitación Sencilla", checkIn: "2024-01-16", checkOut: "2024-01-19", status: "Pendiente" },
  ]

  const quickActions = [
    { name: "Gestionar Reservas", icon: Calendar, description: "Ver y modificar reservas", href: "/admin/reservations" },
    { name: "Configurar Habitaciones", icon: Building, description: "Gestionar disponibilidad", href: "/admin/rooms" },
    { name: "Reportes", icon: BarChart3, description: "Ver reportes financieros", href: "/admin/reports" },
    { name: "Configuración", icon: Settings, description: "Ajustes del sistema", href: "/admin/settings" },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Activa': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'Completada': 'bg-blue-100 text-blue-800'
    }
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel de Administración</h2>
            <p className="text-gray-600">
              Bienvenido, <span className="font-semibold">{user?.nombre || user?.name || user?.correo_usuario}</span>. 
              {user?.cargo_empleado && ` - ${user.cargo_empleado}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Administrador</span>
            </Badge>
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{stat.percentage}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Acciones Rápidas</span>
            </CardTitle>
            <CardDescription>Gestiona el hotel rápidamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => window.location.href = action.href}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <IconComponent className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{action.name}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Reservas Recientes</span>
            </CardTitle>
            <CardDescription>Últimas reservas del hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2 rounded">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.guest}</p>
                      <p className="text-sm text-gray-600">{booking.room}</p>
                      <p className="text-xs text-gray-500">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-mono text-gray-600 mt-1">#{booking.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificaciones Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Bell className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="font-medium">Mantenimiento Programado</p>
                <p className="text-sm text-gray-600">Habitación 205 en mantenimiento hasta mañana</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Nuevo Huésped Registrado</p>
                <p className="text-sm text-gray-600">Juan Pérez se registró en el sistema</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard