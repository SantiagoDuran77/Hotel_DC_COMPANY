"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Users, MapPin, CheckCircle, AlertCircle, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

export default function EmployeeSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const weekSchedule = [
    {
      day: "Lunes",
      date: "15 Ene",
      services: [
        { time: "9:00 AM", title: "Masaje Relajante", client: "María López", room: "205", status: "completed" },
        { time: "11:00 AM", title: "Aromaterapia", client: "Carlos Ruiz", room: "301", status: "completed" },
        { time: "2:00 PM", title: "Reflexología", client: "Ana García", room: "203", status: "completed" },
        { time: "4:00 PM", title: "Masaje Terapéutico", client: "Luis Martín", room: "102", status: "completed" },
      ],
    },
    {
      day: "Martes",
      date: "16 Ene",
      services: [
        { time: "10:00 AM", title: "Masaje Relajante", client: "Carmen Soto", room: "205", status: "completed" },
        { time: "1:00 PM", title: "Servicio de Habitación", client: "Roberto Díaz", room: "401", status: "completed" },
        { time: "3:30 PM", title: "Aromaterapia", client: "Elena Vega", room: "203", status: "completed" },
      ],
    },
    {
      day: "Miércoles",
      date: "17 Ene",
      services: [
        { time: "9:30 AM", title: "Reflexología", client: "Pedro Jiménez", room: "301", status: "completed" },
        { time: "11:30 AM", title: "Masaje Terapéutico", client: "Isabel Cruz", room: "205", status: "completed" },
        { time: "2:30 PM", title: "Aromaterapia", client: "Miguel Ángel", room: "102", status: "completed" },
        { time: "4:30 PM", title: "Masaje Relajante", client: "Sofía Herrera", room: "203", status: "completed" },
      ],
    },
    {
      day: "Jueves",
      date: "18 Ene",
      services: [
        { time: "10:00 AM", title: "Masaje Relajante", client: "María López", room: "205", status: "pending" },
        {
          time: "12:00 PM",
          title: "Servicio de Habitación",
          client: "Carlos Rodríguez",
          room: "101",
          status: "pending",
        },
        { time: "3:00 PM", title: "Aromaterapia", client: "Ana García", room: "203", status: "scheduled" },
        { time: "5:00 PM", title: "Reflexología", client: "Juan Pérez", room: "301", status: "scheduled" },
      ],
    },
    {
      day: "Viernes",
      date: "19 Ene",
      services: [
        { time: "9:00 AM", title: "Masaje Terapéutico", client: "Laura Moreno", room: "205", status: "scheduled" },
        { time: "11:00 AM", title: "Aromaterapia", client: "Diego Ruiz", room: "102", status: "scheduled" },
        { time: "2:00 PM", title: "Masaje Relajante", client: "Patricia Silva", room: "203", status: "scheduled" },
        { time: "4:00 PM", title: "Reflexología", client: "Andrés López", room: "301", status: "scheduled" },
      ],
    },
    {
      day: "Sábado",
      date: "20 Ene",
      services: [
        { time: "10:00 AM", title: "Masaje Relajante", client: "Cristina Vargas", room: "205", status: "scheduled" },
        { time: "1:00 PM", title: "Aromaterapia", client: "Fernando Gil", room: "203", status: "scheduled" },
        { time: "3:30 PM", title: "Servicio de Habitación", client: "Mónica Reyes", room: "401", status: "scheduled" },
      ],
    },
    {
      day: "Domingo",
      date: "21 Ene",
      services: [
        { time: "11:00 AM", title: "Masaje Relajante", client: "Alejandro Paz", room: "205", status: "scheduled" },
        { time: "2:00 PM", title: "Reflexología", client: "Beatriz Campos", room: "301", status: "scheduled" },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "scheduled":
        return "Programado"
      default:
        return status
    }
  }

  const totalServices = weekSchedule.reduce((acc, day) => acc + day.services.length, 0)
  const completedServices = weekSchedule.reduce(
    (acc, day) => acc + day.services.filter((s) => s.status === "completed").length,
    0,
  )
  const pendingServices = weekSchedule.reduce(
    (acc, day) => acc + day.services.filter((s) => s.status === "pending").length,
    0,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Horario</h1>
          <p className="text-gray-600">Gestiona tu agenda y servicios programados</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Semana del 15-21 Enero</span>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Servicios</p>
                <p className="text-2xl font-bold text-blue-600">{totalServices}</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">{completedServices}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((completedServices / totalServices) * 100)}% del total
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
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingServices}</p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horas Programadas</p>
                <p className="text-2xl font-bold text-purple-600">32h</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekSchedule.map((day, dayIndex) => (
          <Card key={dayIndex} className="h-fit">
            <CardHeader className="pb-3">
              <div className="text-center">
                <CardTitle className="text-lg">{day.day}</CardTitle>
                <CardDescription>{day.date}</CardDescription>
                <Badge variant="secondary" className="mt-1">
                  {day.services.length} servicios
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">{service.time}</span>
                    <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{service.title}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <Users className="h-3 w-3 mr-1" />
                      {service.client}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      Hab. {service.room}
                    </div>
                  </div>
                  {service.status === "pending" && (
                    <Button size="sm" className="w-full mt-2 text-xs">
                      Iniciar
                    </Button>
                  )}
                </div>
              ))}
              {day.services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin servicios programados</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Vista de Calendario</CardTitle>
          <CardDescription>Selecciona una fecha para ver los detalles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="lg:w-2/3">
              <h3 className="font-semibold mb-4">
                Servicios para{" "}
                {selectedDate?.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-3">
                {/* Aquí mostrarías los servicios para la fecha seleccionada */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">10:00 AM - 11:00 AM</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                  </div>
                  <h4 className="font-medium mb-1">Masaje Relajante</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      María López
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Habitación 205
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
