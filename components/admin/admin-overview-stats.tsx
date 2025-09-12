"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export function AdminOverviewStats() {
  const [stats, setStats] = useState({
    totalRooms: 50,
    availableRooms: 32,
    occupiedRooms: 18,
    maintenanceRooms: 3,
    totalBookings: 156,
    pendingBookings: 12,
    confirmedBookings: 128,
    cancelledBookings: 16,
    totalRevenue: 45680,
    monthlyRevenue: 12340,
    totalGuests: 89,
    checkInsToday: 8,
    checkOutsToday: 5,
    occupancyRate: 64,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Habitaciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRooms}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {stats.availableRooms} disponibles
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {stats.occupiedRooms} ocupadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reservas Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>{stats.confirmedBookings} confirmadas</span>
            <Clock className="h-3 w-3 text-yellow-600 ml-2" />
            <span>{stats.pendingBookings} pendientes</span>
          </div>
        </CardContent>
      </Card>

      {/* Ingresos del Mes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+12.5% vs mes anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Tasa de Ocupación */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+5.2% vs semana anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Check-ins Hoy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Check-ins Hoy</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.checkInsToday}</div>
          <p className="text-xs text-muted-foreground">{stats.checkOutsToday} check-outs programados</p>
        </CardContent>
      </Card>

      {/* Huéspedes Actuales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Huéspedes Actuales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGuests}</div>
          <p className="text-xs text-muted-foreground">En {stats.occupiedRooms} habitaciones ocupadas</p>
        </CardContent>
      </Card>

      {/* Habitaciones en Mantenimiento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.maintenanceRooms}</div>
          <p className="text-xs text-muted-foreground">Habitaciones fuera de servicio</p>
        </CardContent>
      </Card>

      {/* Ingresos Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-600">+8.1% vs año anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
