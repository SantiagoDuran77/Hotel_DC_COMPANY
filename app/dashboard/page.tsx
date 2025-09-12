"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CreditCard, User, Bell, Phone, Mail, Clock, Star, Plus, Settings } from "lucide-react"
import * as authUtils from "@/lib/auth"

export default function CustomerDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = authUtils.getCurrentUser()

    if (!user || !authUtils.isCustomer(user)) {
      router.push("/auth/login")
      return
    }

    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  const upcomingReservations = [
    {
      id: 1,
      roomType: "Suite Presidencial",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      guests: 2,
      status: "confirmed",
      total: "$1,200",
    },
    {
      id: 2,
      roomType: "Habitación Deluxe",
      checkIn: "2024-03-10",
      checkOut: "2024-03-12",
      guests: 1,
      status: "pending",
      total: "$450",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      description: "Reserva confirmada para Suite Presidencial",
      date: "2024-01-20",
      icon: Calendar,
    },
    {
      id: 2,
      type: "payment",
      description: "Pago procesado exitosamente",
      date: "2024-01-20",
      icon: CreditCard,
    },
    {
      id: 3,
      type: "profile",
      description: "Perfil actualizado",
      date: "2024-01-18",
      icon: User,
    },
  ]

  const quickActions = [
    {
      title: "Nueva Reserva",
      description: "Reservar una habitación",
      icon: Plus,
      href: "/booking",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Mis Reservas",
      description: "Ver todas mis reservas",
      icon: Calendar,
      href: "/dashboard/reservations",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Mi Perfil",
      description: "Editar información personal",
      icon: User,
      href: "/dashboard/profile",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Configuración",
      description: "Ajustes de cuenta",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de cliente...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">¡Bienvenido, {currentUser.name}!</h1>
                <p className="text-blue-100 mt-1">Gestiona tus reservas y preferencias</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Button
                    className={`w-full h-auto p-4 flex-col space-y-2 ${action.color} text-white`}
                    onClick={() => router.push(action.href)}
                  >
                    <Icon className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs opacity-90">{action.description}</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Reservations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Reservas
              </CardTitle>
              <CardDescription>Tus reservas confirmadas y pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{reservation.roomType}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {reservation.checkIn} - {reservation.checkOut}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {reservation.guests} huésped{reservation.guests > 1 ? "es" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                          <span className="font-bold text-green-600 text-lg">{reservation.total}</span>
                          <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                            {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tienes reservas próximas</p>
                  <Button onClick={() => router.push("/booking")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Hacer una Reserva
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Summary & Recent Activity */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mi Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{currentUser.phone}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Estado de Lealtad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">Gold</div>
                  <p className="text-sm text-gray-600 mb-4">Miembro desde 2023</p>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800">¡Disfruta de un 15% de descuento en tu próxima reserva!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
