"use client"

import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de reservas simulados
const upcomingReservations = [
  {
    id: "res-002",
    roomId: "premium-double",
    roomName: "Habitación Premium Doble",
    checkIn: "2024-01-10",
    checkOut: "2024-01-15",
    guests: 3,
    status: "confirmed",
    totalPrice: 1245,
    isPaid: false,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "res-004",
    roomId: "family-suite",
    roomName: "Suite Familiar",
    checkIn: "2024-02-20",
    checkOut: "2024-02-25",
    guests: 4,
    status: "confirmed",
    totalPrice: 1995,
    isPaid: false,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "res-007",
    roomId: "presidential-suite",
    roomName: "Suite Presidencial",
    checkIn: "2024-03-15",
    checkOut: "2024-03-20",
    guests: 2,
    status: "confirmed",
    totalPrice: 2995,
    isPaid: true,
    image: "/placeholder.svg?height=100&width=150",
  },
]

interface UpcomingReservationsProps {
  limit?: number
}

export default function UpcomingReservations({ limit }: UpcomingReservationsProps) {
  const reservations = limit ? upcomingReservations.slice(0, limit) : upcomingReservations

  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tiene reservas próximas.</p>
      ) : (
        reservations.map((reservation) => (
          <div key={reservation.id} className="flex border rounded-lg overflow-hidden">
            <div className="w-1/3 relative">
              <img
                src={reservation.image || "/placeholder.svg"}
                alt={reservation.roomName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-2/3 p-4">
              <h4 className="font-semibold text-gray-900">{reservation.roomName}</h4>

              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(parseISO(reservation.checkIn), "PPP", { locale: es })} -{" "}
                    {format(parseISO(reservation.checkOut), "PPP", { locale: es })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Hotel de Lujo, Madrid</span>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">${reservation.totalPrice}</span>
                  {!reservation.isPaid && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente de pago
                    </span>
                  )}
                </div>

                {!reservation.isPaid && (
                  <Link href={`/dashboard/payment/${reservation.id}`}>
                    <Button size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {limit && upcomingReservations.length > limit && (
        <div className="text-center mt-4">
          <Link href="/dashboard/reservations" className="text-primary hover:underline">
            Ver todas las reservas
          </Link>
        </div>
      )}
    </div>
  )
}
