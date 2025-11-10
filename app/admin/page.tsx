// app/admin/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Reservas Activas",
      value: "127",
      change: "+12%",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Habitaciones Ocupadas",
      value: "89/120",
      change: "74%",
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Ingresos del Mes",
      value: "€45,230",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Usuarios Registrados",
      value: "1,234",
      change: "+23",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Nueva reserva creada",
      user: "Juan Pérez",
      time: "Hace 5 minutos",
      status: "success",
    },
    {
      id: 2,
      action: "Check-out completado",
      user: "María García",
      time: "Hace 15 minutos",
      status: "success",
    },
    {
      id: 3,
      action: "Mantenimiento programado",
      user: "Sistema",
      time: "Hace 30 minutos",
      status: "warning",
    },
    {
      id: 4,
      action: "Pago procesado",
      user: "Carlos Rodríguez",
      time: "Hace 1 hora",
      status: "success",
    },
  ]

  const alerts = [
    {
      id: 1,
      message: "Habitación 205 requiere mantenimiento",
      type: "warning",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      message: "Inventario de toallas bajo",
      type: "info",
      time: "Hace 4 horas",
    },
    {
      id: 3,
      message: "Backup completado exitosamente",
      type: "success",
      time: "Hace 6 horas",
    },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600">Resumen general del sistema hotelero</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas del Sistema</CardTitle>
            <CardDescription>Notificaciones importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.type === "warning"
                          ? "text-yellow-500"
                          : alert.type === "success"
                            ? "text-green-500"
                            : "text-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  <Badge
                    variant={
                      alert.type === "warning" ? "destructive" : alert.type === "success" ? "default" : "secondary"
                    }
                  >
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Gestión rápida del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-6 w-6 mb-2" />
              Gestionar Usuarios
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Building className="h-6 w-6 mb-2" />
              Habitaciones
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="h-6 w-6 mb-2" />
              Reservas
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <DollarSign className="h-6 w-6 mb-2" />
              Facturación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}