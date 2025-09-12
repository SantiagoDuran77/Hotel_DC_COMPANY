"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Clock, Users, MapPin, Timer, Search, Filter, CheckCircle, AlertCircle, Calendar } from "lucide-react"

export default function EmployeeServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const services = [
    {
      id: 1,
      title: "Masaje Relajante",
      client: "María López",
      room: "205",
      time: "10:00 AM",
      duration: "60 min",
      status: "pending",
      priority: "high",
      notes: "Cliente prefiere presión media, aceites de lavanda",
      phone: "+1-555-0123",
      specialRequests: ["Música relajante", "Temperatura ambiente cálida"],
    },
    {
      id: 2,
      title: "Servicio de Habitación - Cena Romántica",
      client: "Carlos Rodríguez",
      room: "101",
      time: "7:30 PM",
      duration: "45 min",
      status: "in-progress",
      priority: "medium",
      notes: "Aniversario de bodas, decoración especial solicitada",
      phone: "+1-555-0124",
      specialRequests: ["Velas aromáticas", "Pétalos de rosa", "Champagne"],
    },
    {
      id: 3,
      title: "Transporte al Aeropuerto",
      client: "Juan Pérez",
      room: "301",
      time: "6:00 AM",
      duration: "45 min",
      status: "completed",
      priority: "high",
      notes: "Vuelo a las 8:30 AM, equipaje pesado",
      phone: "+1-555-0125",
      specialRequests: ["Ayuda con equipaje"],
    },
    {
      id: 4,
      title: "Aromaterapia",
      client: "Ana García",
      room: "203",
      time: "3:00 PM",
      duration: "90 min",
      status: "scheduled",
      priority: "low",
      notes: "Primera vez, explicar el proceso",
      phone: "+1-555-0126",
      specialRequests: ["Explicación detallada", "Aceites suaves"],
    },
  ]

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in-progress":
        return "En Progreso"
      case "pending":
        return "Pendiente"
      case "scheduled":
        return "Programado"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-600">Gestiona todos tus servicios asignados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar servicios o clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {services.filter((s) => s.status === "pending").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {services.filter((s) => s.status === "in-progress").length}
                </p>
              </div>
              <Timer className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter((s) => s.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programados</p>
                <p className="text-2xl font-bold text-purple-600">
                  {services.filter((s) => s.status === "scheduled").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({services.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({services.filter((s) => s.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            En Progreso ({services.filter((s) => s.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({services.filter((s) => s.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className={`border-l-4 ${getPriorityColor(service.priority)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <Badge className={getStatusColor(service.status)}>{getStatusText(service.status)}</Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          service.priority === "high"
                            ? "border-red-500 text-red-700"
                            : service.priority === "medium"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-green-500 text-green-700"
                        }`}
                      >
                        {service.priority === "high" ? "Alta" : service.priority === "medium" ? "Media" : "Baja"}{" "}
                        Prioridad
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="font-medium">Cliente:</span>
                          <span className="ml-1">{service.client}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-medium">Habitación:</span>
                          <span className="ml-1">{service.room}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">Hora:</span>
                          <span className="ml-1">{service.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Timer className="h-4 w-4 mr-2" />
                          <span className="font-medium">Duración:</span>
                          <span className="ml-1">{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notas especiales:</p>
                      <p className="text-sm text-gray-600">{service.notes}</p>
                    </div>

                    {service.specialRequests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Solicitudes especiales:</p>
                        <div className="flex flex-wrap gap-2">
                          {service.specialRequests.map((request, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {request}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {service.status === "pending" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Iniciar Servicio
                      </Button>
                    )}
                    {service.status === "in-progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        Completar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      Contactar Cliente
                    </Button>
                    <Button size="sm" variant="ghost">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredServices
            .filter((s) => s.status === "pending")
            .map((service) => (
              <Card key={service.id} className={`border-l-4 ${getPriorityColor(service.priority)}`}>
                <CardContent className="p-6">
                  {/* Same content structure as above */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <Badge className={getStatusColor(service.status)}>{getStatusText(service.status)}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Cliente:</span>
                            <span className="ml-1">{service.client}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Habitación:</span>
                            <span className="ml-1">{service.room}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">Hora:</span>
                            <span className="ml-1">{service.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Timer className="h-4 w-4 mr-2" />
                            <span className="font-medium">Duración:</span>
                            <span className="ml-1">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Iniciar Servicio
                      </Button>
                      <Button size="sm" variant="ghost">
                        Contactar Cliente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Similar structure for other tabs */}
        <TabsContent value="in-progress" className="space-y-4">
          {filteredServices
            .filter((s) => s.status === "in-progress")
            .map((service) => (
              <Card key={service.id} className={`border-l-4 ${getPriorityColor(service.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <Badge className={getStatusColor(service.status)}>{getStatusText(service.status)}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Cliente:</span>
                            <span className="ml-1">{service.client}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Habitación:</span>
                            <span className="ml-1">{service.room}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">Hora:</span>
                            <span className="ml-1">{service.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Timer className="h-4 w-4 mr-2" />
                            <span className="font-medium">Duración:</span>
                            <span className="ml-1">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        Completar
                      </Button>
                      <Button size="sm" variant="ghost">
                        Pausar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredServices
            .filter((s) => s.status === "completed")
            .map((service) => (
              <Card key={service.id} className={`border-l-4 ${getPriorityColor(service.priority)} opacity-75`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <Badge className={getStatusColor(service.status)}>{getStatusText(service.status)}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Cliente:</span>
                            <span className="ml-1">{service.client}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Habitación:</span>
                            <span className="ml-1">{service.room}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">Hora:</span>
                            <span className="ml-1">{service.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Timer className="h-4 w-4 mr-2" />
                            <span className="font-medium">Duración:</span>
                            <span className="ml-1">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="ghost">
                        Ver Reporte
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
