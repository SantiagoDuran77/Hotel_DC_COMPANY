"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Bed, DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { databaseService } from "@/lib/services/database"

export function AdminDashboardEnhanced() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalHabitaciones: 0,
    totalReservas: 0,
    totalServicios: 0,
    occupancyRate: 0,
    revenue: 0,
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const usuarios = await databaseService.getUsuarios()
      const habitaciones = await databaseService.getHabitaciones()
      const reservas = await databaseService.getReservas()
      const servicios = await databaseService.getServicios()
      const occupancyRate = await databaseService.getOccupancyRate()
      const revenue = await databaseService.getRevenueByPeriod(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      )

      setStats({
        totalUsuarios: usuarios.length,
        totalHabitaciones: habitaciones.length,
        totalReservas: reservas.length,
        totalServicios: servicios.length,
        occupancyRate,
        revenue,
      })

      // Simular actividad reciente
      setRecentActivity([
        {
          id: 1,
          type: "reserva",
          description: "Nueva reserva creada por Juan Pérez",
          timestamp: new Date(),
          status: "success",
        },
        {
          id: 2,
          type: "habitacion",
          description: "Habitación 101 marcada para mantenimiento",
          timestamp: new Date(Date.now() - 3600000),
          status: "warning",
        },
        {
          id: 3,
          type: "usuario",
          description: "Nuevo cliente registrado: María García",
          timestamp: new Date(Date.now() - 7200000),
          status: "success",
        },
      ])

      // Simular alertas del sistema
      setSystemAlerts([
        {
          id: 1,
          type: "warning",
          message: "Habitación 205 requiere mantenimiento",
          priority: "high",
        },
        {
          id: 2,
          type: "info",
          message: "Backup de base de datos completado",
          priority: "low",
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">Clientes y empleados registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habitaciones</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHabitaciones}</div>
            <p className="text-xs text-muted-foreground">Ocupación: {stats.occupancyRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservas}</div>
            <p className="text-xs text-muted-foreground">Total de reservas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos del mes actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes secciones */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="alerts">Alertas del Sistema</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Habitaciones</CardTitle>
                <CardDescription>Distribución actual del estado de las habitaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disponibles</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {Math.floor(stats.totalHabitaciones * 0.7)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ocupadas</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {Math.floor(stats.totalHabitaciones * 0.2)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mantenimiento</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {Math.floor(stats.totalHabitaciones * 0.1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios Activos</CardTitle>
                <CardDescription>Servicios disponibles en el hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Servicios</span>
                    <Badge variant="outline">{stats.totalServicios}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disponibles</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {stats.totalServicios}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Categorías</span>
                    <Badge variant="outline">4</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp.toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
              <CardDescription>Notificaciones importantes que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                    <Badge variant={alert.priority === "high" ? "destructive" : "outline"} className="capitalize">
                      {alert.priority}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Resolver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Servicios</CardTitle>
              <CardDescription>Servicios disponibles según el diagrama de clases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Servicios de Habitación</h4>
                  <div className="space-y-1">
                    <Badge variant="outline">Servicio de habitaciones</Badge>
                    <Badge variant="outline">Limpieza adicional</Badge>
                    <Badge variant="outline">Amenidades premium</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Servicios de Bienestar</h4>
                  <div className="space-y-1">
                    <Badge variant="outline">Spa</Badge>
                    <Badge variant="outline">Gimnasio</Badge>
                    <Badge variant="outline">Piscina</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Servicios de Transporte</h4>
                  <div className="space-y-1">
                    <Badge variant="outline">Traslado aeropuerto</Badge>
                    <Badge variant="outline">Taxi</Badge>
                    <Badge variant="outline">Alquiler de autos</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Servicios de Alimentación</h4>
                  <div className="space-y-1">
                    <Badge variant="outline">Restaurante</Badge>
                    <Badge variant="outline">Bar</Badge>
                    <Badge variant="outline">Catering</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
