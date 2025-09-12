"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminRecentBookings() {
  const [bookings, setBookings] = useState([
    {
      id: "B-1001",
      customer: {
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      room: "Suite Ejecutiva 405",
      checkIn: "2023-05-15",
      checkOut: "2023-05-20",
      amount: "$1,250.00",
      status: "confirmed",
    },
    {
      id: "B-1002",
      customer: {
        name: "María López",
        email: "maria@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      room: "Deluxe King 302",
      checkIn: "2023-05-16",
      checkOut: "2023-05-18",
      amount: "$450.00",
      status: "pending",
    },
    {
      id: "B-1003",
      customer: {
        name: "Juan Pérez",
        email: "juan@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      room: "Estándar Twin 201",
      checkIn: "2023-05-17",
      checkOut: "2023-05-19",
      amount: "$320.00",
      status: "confirmed",
    },
    {
      id: "B-1004",
      customer: {
        name: "Ana Martínez",
        email: "ana@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      room: "Suite Familiar 501",
      checkIn: "2023-05-20",
      checkOut: "2023-05-25",
      amount: "$1,800.00",
      status: "cancelled",
    },
    {
      id: "B-1005",
      customer: {
        name: "Roberto Sánchez",
        email: "roberto@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      room: "Premium Queen 304",
      checkIn: "2023-05-18",
      checkOut: "2023-05-21",
      amount: "$680.00",
      status: "confirmed",
    },
  ])
  const { toast } = useToast()

  const viewBookingDetails = (booking: any) => {
    toast({
      title: "Ver detalles",
      description: `Viendo detalles de la reserva ${booking.id}`,
      duration: 3000,
    })
  }

  const editBooking = (booking: any) => {
    toast({
      title: "Editar reserva",
      description: `Editando la reserva ${booking.id}`,
      duration: 3000,
    })
  }

  const cancelBooking = (booking: any) => {
    setBookings((prevBookings) => prevBookings.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)))

    toast({
      title: "Reserva cancelada",
      description: `La reserva ${booking.id} ha sido cancelada.`,
      duration: 3000,
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Habitación</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Check-in</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Check-out</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Monto</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={booking.customer.avatar} alt={booking.customer.name} />
                        <AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{booking.customer.name}</div>
                        <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{booking.room}</td>
                  <td className="p-4 align-middle">{booking.checkIn}</td>
                  <td className="p-4 align-middle">{booking.checkOut}</td>
                  <td className="p-4 align-middle">{booking.amount}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {booking.status === "confirmed"
                        ? "Confirmada"
                        : booking.status === "pending"
                          ? "Pendiente"
                          : "Cancelada"}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => viewBookingDetails(booking)}>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editBooking(booking)}>Editar reserva</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {booking.status !== "cancelled" && (
                          <DropdownMenuItem className="text-red-600" onClick={() => cancelBooking(booking)}>
                            Cancelar reserva
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/bookings")}>
          Ver todas las reservas
        </Button>
      </div>
    </div>
  )
}
