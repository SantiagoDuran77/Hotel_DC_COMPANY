"use client"

import { useState } from "react"
import { format, eachDayOfInterval, isSameDay, isWithinInterval, addMonths } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Datos simulados de disponibilidad
const unavailableDates = [
  { start: new Date(2023, 11, 24), end: new Date(2023, 11, 26) }, // Navidad
  { start: new Date(2023, 11, 31), end: new Date(2024, 0, 2) }, // Año Nuevo
  { start: new Date(2024, 1, 14), end: new Date(2024, 1, 16) }, // San Valentín
  { start: new Date(2024, 3, 5), end: new Date(2024, 3, 10) }, // Semana Santa
]

// Datos simulados de precios especiales
const specialPrices = [
  { date: new Date(2023, 11, 24), price: 299 }, // Nochebuena
  { date: new Date(2023, 11, 31), price: 399 }, // Nochevieja
  { date: new Date(2024, 1, 14), price: 299 }, // San Valentín
  // Añadir más fechas con precios especiales
]

// Precio base por defecto
const basePrice = 199

export default function AvailabilityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState("deluxe-king")

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some((range) => isWithinInterval(date, { start: range.start, end: range.end }))
  }

  const getDatePrice = (date: Date) => {
    const specialPrice = specialPrices.find((sp) => isSameDay(sp.date, date))
    return specialPrice ? specialPrice.price : basePrice
  }

  const renderCalendarDays = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDate = monthStart
    const endDate = monthEnd

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })

    const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(monthStart.getFullYear(), monthStart.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 p-1"></div>
          ))}

          {dateRange.map((date, i) => {
            const isUnavailable = isDateUnavailable(date)
            const price = getDatePrice(date)
            const isSpecialPrice = specialPrices.some((sp) => isSameDay(sp.date, date))

            return (
              <div
                key={i}
                className={`h-24 p-1 border rounded-md ${
                  isUnavailable ? "bg-gray-100 text-gray-400" : "hover:border-primary cursor-pointer"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="text-right">
                    <span className={`text-sm ${isUnavailable ? "text-gray-400" : ""}`}>{format(date, "d")}</span>
                  </div>

                  {!isUnavailable && (
                    <div className="flex-grow flex flex-col justify-center items-center">
                      <span className={`font-bold ${isSpecialPrice ? "text-primary" : ""}`}>${price}</span>
                      {isSpecialPrice && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Oferta
                        </Badge>
                      )}
                    </div>
                  )}

                  {isUnavailable && (
                    <div className="flex-grow flex justify-center items-center">
                      <span className="text-xs text-gray-400">No disponible</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">
              Disponibilidad para {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="deluxe-king">Habitación Deluxe King</option>
              <option value="premium-double">Habitación Premium Doble</option>
              <option value="executive-suite">Suite Ejecutiva</option>
              <option value="family-suite">Suite Familiar</option>
              <option value="presidential-suite">Suite Presidencial</option>
            </select>

            <Button>Ver Disponibilidad</Button>
          </div>

          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border rounded-sm mr-1"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border rounded-sm mr-1"></div>
              <span>No disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-primary rounded-sm mr-1"></div>
              <span>Precio especial</span>
            </div>
          </div>
        </div>

        {renderCalendarDays()}

        <div className="mt-6 text-sm text-gray-500">
          <p>* Los precios mostrados son por noche para la habitación seleccionada.</p>
          <p>* Las fechas no disponibles pueden estar reservadas o bloqueadas por el hotel.</p>
          <p>* Para reservar, seleccione una fecha disponible y complete el proceso de reserva.</p>
        </div>
      </CardContent>
    </Card>
  )
}
