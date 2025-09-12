"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users, Star, TrendingUp, DollarSign, Award } from "lucide-react"
import * as authUtils from "@/lib/auth"

export default function EmployeeDashboard() {
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const user = authUtils.getCurrentUser()
    setCurrentUser(user)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: "Servicios Hoy",
      value: "8",
      change: "+2 desde ayer",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clientes Atendidos",
      value: "24",
      change: "+12% esta semana",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rating Promedio",
      value: currentUser?.rating?.toFixed(1) || "4.8",
      change: "+0.2 este mes",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Ingresos Generados",
      value: "$1,240",
      change: "+8% esta semana",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const todayServices = [
    {
      id: 1,
      time: "09:00",
      client: "María González",
      service: "Masaje Relajante",
      duration: "60 min",
      status: "completed",
      price: "$80",
    },
    {
      id: 2,
      time: "10:30",
      client: "Carlos Ruiz",
      service: "Aromaterapia",
      duration: "45 min",
      status: "completed",
      price: "$65",
    },
    {
      id: 3,
      time: "14:00",
      client: "Ana Martín",
      service: "Masaje Deportivo",
      duration: "90 min",
      status: "in-progress",
      price: "$120",
    },
    {
      id: 4,
      time: "16:00",
      client: "Luis Fernández",
      service: "Reflexología",
      duration: "60 min",
      status: "pending",
      price: "$75",
    },
    {
      id: 5,
      time: "17:30",
      client: "Carmen López",
      service: "Masaje Relajante",
      duration: "60 min",
      status: "pending",
      price: "$80",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department?.toLowerCase()) {
      case "spa":
        return "from-green-400 to-green-600"
      case "restaurante":
        return "from-orange-400 to-orange-600"
      case "transporte":
        return "from-blue-400 to-blue-600"
      case "housekeeping":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  if (!currentUser) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`bg-gradient-to-r ${getDepartmentColor(currentUser.department || "")} rounded-lg p-6 text-white`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">¡Bienvenido, {currentUser.name}!</h1>
            <p className="text-lg opacity-90 mt-1">
              {currentUser.position} - {currentUser.department}
            </p>
            <p className="opacity-75 mt-2">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <div className="text-3xl font-bold">
              {currentTime.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <p className="opacity-75">Hora actual</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Services */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Servicios de Hoy
            </CardTitle>
            <CardDescription>Gestiona tus servicios programados para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{service.time}</div>
                      <div className="text-xs text-gray-500">{service.duration}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{service.client}</h4>
                      <p className="text-sm text-gray-600">{service.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                    <span className="font-semibold text-green-600">{service.price}</span>
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Servicios Completados</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Satisfacción Cliente</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Puntualidad</span>
                  <span>96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Ver Horario Completo
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Lista de Clientes
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Award className="mr-2 h-4 w-4" />
                Mis Certificaciones
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Reseñas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-400 pl-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">"Excelente servicio, muy profesional"</p>
                  <p className="text-xs text-gray-400 mt-1">- María G.</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">"Me sentí muy relajada, lo recomiendo"</p>
                  <p className="text-xs text-gray-400 mt-1">- Ana M.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
