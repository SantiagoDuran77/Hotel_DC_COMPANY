"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, MapPin, Users, ArrowLeft, Eye, Download } from "lucide-react"
import * as authUtils from "@/lib/auth"

export default function ReservationsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const user = authUtils.getCurrentUser()

    if (!user || !authUtils.isCustomer(user)) {
      router.push("/auth/login")
      return
    }

    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  const reservations = [
    {
      id: "RES-001",
      roomType: "Suite Presidencial",
      roomNumber: "101",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      guests: 2,
      status: "confirmed",
      total: "$1,200",
      services: ["Spa", "Desayuno incluido", "Transporte"],
      bookingDate: "2024-01-20",
    },
    {
      id: "RES-002",
      roomType: "Habitación Deluxe",
      roomNumber: "205",
      checkIn: "2024-03-10",
      checkOut: "2024-03-12",
      guests: 1,
      status: "pending",
      total: "$450",
      services: ["Desayuno incluido"],
      bookingDate: "2024-02-01",
    },
    {
      id: "RES-003",
      roomType: "Habitación Estándar",
      roomNumber: "302",
      checkIn: "2024-01-05",
      checkOut: "2024-01-08",
      guests: 2,
      status: "completed",
      total: "$320",
      services: ["Desayuno incluido"],
      bookingDate: "2023-12-15",
    },
    {
      id: "RES-004",
      roomType: "Suite Junior",
      roomNumber: "150",
      checkIn: "2023-12-20",
      checkOut: "2023-12-23",
      guests: 3,
      status: "cancelled",
      total: "$680",
      services: ["Spa", "Cena romántica"],
      bookingDate: "2023-11-25",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reservas...</p>
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
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">Gestiona y revisa todas tus reservas</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por tipo de habitación o ID de reserva..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{reservation.roomType}</h3>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Check-in</p>
                            <p>{reservation.checkIn}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Check-out</p>
                            <p>{reservation.checkOut}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Habitación</p>
                            <p>{reservation.roomNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <div>
                            <p className="font-medium">Huéspedes</p>
                            <p>{reservation.guests}</p>
                          </div>
                        </div>
                      </div>

                      {reservation.services.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Servicios incluidos:</p>
                          <div className="flex flex-wrap gap-2">
                            {reservation.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{reservation.total}</p>
                        <p className="text-sm text-gray-500">ID: {reservation.id}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </Button>
                        {reservation.status === "confirmed" && (
                          <Button variant="destructive" size="sm">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reservas</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Intenta ajustar tus filtros de búsqueda"
                    : "Aún no tienes reservas. ¡Haz tu primera reserva ahora!"}
                </p>
                <Button onClick={() => router.push("/booking")}>Nueva Reserva</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        {filteredReservations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resumen de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {reservations.filter((r) => r.status === "confirmed").length}
                  </p>
                  <p className="text-sm text-gray-600">Confirmadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reservations.filter((r) => r.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {reservations.filter((r) => r.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{reservations.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
