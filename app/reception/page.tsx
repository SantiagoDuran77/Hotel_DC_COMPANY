"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, UserMinus, Calendar, Clock, Phone, Mail, MapPin, CreditCard } from "lucide-react"
import * as authUtils from "@/lib/auth"

export default function ReceptionDashboard() {
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = authUtils.getCurrentUser()
    if (!user || (user.role !== "reception" && user.role !== "admin")) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Cargando panel de recepción...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const todayCheckIns = [
    {
      id: 1,
      guest: "Juan Pérez",
      room: "205",
      time: "14:00",
      status: "pending",
      phone: "+34 666 123 456",
      email: "juan@email.com",
    },
    {
      id: 2,
      guest: "María García",
      room: "312",
      time: "15:30",
      status: "completed",
      phone: "+34 666 789 012",
      email: "maria@email.com",
    },
    {
      id: 3,
      guest: "Carlos Rodríguez",
      room: "108",
      time: "16:00",
      status: "pending",
      phone: "+34 666 345 678",
      email: "carlos@email.com",
    },
  ]

  const todayCheckOuts = [
    {
      id: 1,
      guest: "Ana López",
      room: "401",
      time: "11:00",
      status: "completed",
      phone: "+34 666 901 234",
      email: "ana@email.com",
    },
    {
      id: 2,
      guest: "Pedro Martín",
      room: "203",
      time: "12:00",
      status: "pending",
      phone: "+34 666 567 890",
      email: "pedro@email.com",
    },
  ]

  const pendingTasks = [
    {
      id: 1,
      task: "Confirmar reserva para mañana",
      priority: "high",
      time: "Hace 30 min",
    },
    {
      id: 2,
      task: "Procesar pago pendiente Hab. 205",
      priority: "medium",
      time: "Hace 1 hora",
    },
    {
      id: 3,
      task: "Actualizar estado habitación 312",
      priority: "low",
      time: "Hace 2 horas",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Recepción</h1>
              <p className="text-gray-600">Bienvenido, {currentUser.name}</p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar huésped o reserva..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Nueva Reserva
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-ins Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-outs Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <UserMinus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ocupación</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Check-ins de Hoy
              </CardTitle>
              <CardDescription>Llegadas programadas para hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayCheckIns.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{checkin.guest}</p>
                          <p className="text-sm text-gray-500">Habitación {checkin.room}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-xs text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {checkin.phone}
                            </span>
                            <span className="flex items-center text-xs text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {checkin.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{checkin.time}</p>
                        <Badge variant={checkin.status === "completed" ? "default" : "secondary"}>
                          {checkin.status === "completed" ? "Completado" : "Pendiente"}
                        </Badge>
                      </div>
                      {checkin.status === "pending" && <Button size="sm">Check-in</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Check-outs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserMinus className="h-5 w-5 mr-2" />
                Check-outs de Hoy
              </CardTitle>
              <CardDescription>Salidas programadas para hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayCheckOuts.map((checkout) => (
                  <div key={checkout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{checkout.guest}</p>
                          <p className="text-sm text-gray-500">Habitación {checkout.room}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-xs text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {checkout.phone}
                            </span>
                            <span className="flex items-center text-xs text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {checkout.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{checkout.time}</p>
                        <Badge variant={checkout.status === "completed" ? "default" : "secondary"}>
                          {checkout.status === "completed" ? "Completado" : "Pendiente"}
                        </Badge>
                      </div>
                      {checkout.status === "pending" && (
                        <Button size="sm" variant="outline">
                          Check-out
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tareas Pendientes
            </CardTitle>
            <CardDescription>Acciones que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Completar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Funciones frecuentes de recepción</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Calendar className="h-6 w-6 mb-2" />
                Ver Reservas
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <CreditCard className="h-6 w-6 mb-2" />
                Procesar Pago
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <MapPin className="h-6 w-6 mb-2" />
                Estado Habitaciones
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Phone className="h-6 w-6 mb-2" />
                Contactar Huésped
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
