"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, Trash2, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import * as authUtils from "@/lib/auth"

export function AdminBookingsTable() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState([
    {
      id: "b1",
      roomNumber: "101",
      guestName: "Carlos Rodríguez",
      checkIn: "2023-06-15",
      checkOut: "2023-06-18",
      status: "confirmed",
      totalAmount: 360,
      paymentStatus: "paid",
      createdAt: "2023-05-10 14:30",
    },
    {
      id: "b2",
      roomNumber: "102",
      guestName: "María López",
      checkIn: "2023-06-20",
      checkOut: "2023-06-25",
      status: "pending",
      totalAmount: 600,
      paymentStatus: "pending",
      createdAt: "2023-05-12 09:45",
    },
    {
      id: "b3",
      roomNumber: "201",
      guestName: "Juan Pérez",
      checkIn: "2023-07-01",
      checkOut: "2023-07-05",
      status: "confirmed",
      totalAmount: 1000,
      paymentStatus: "paid",
      createdAt: "2023-05-15 16:20",
    },
    {
      id: "b4",
      roomNumber: "301",
      guestName: "Ana Martínez",
      checkIn: "2023-07-10",
      checkOut: "2023-07-15",
      status: "cancelled",
      totalAmount: 2500,
      paymentStatus: "refunded",
      createdAt: "2023-05-05 11:10",
    },
    {
      id: "b5",
      roomNumber: "202",
      guestName: "Roberto Sánchez",
      checkIn: "2023-06-28",
      checkOut: "2023-06-30",
      status: "confirmed",
      totalAmount: 360,
      paymentStatus: "paid",
      createdAt: "2023-05-18 13:15",
    },
  ])

  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const currentUser = authUtils.getCurrentUser()
  const isAdmin = authUtils.isAdmin(currentUser)

  const handleChangeStatus = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar el estado de las reservas",
        variant: "destructive",
      })
      return
    }

    setBookings(
      bookings.map((booking) => {
        if (booking.id === selectedBooking.id) {
          return { ...booking, status: newStatus }
        }
        return booking
      }),
    )

    toast({
      title: "Estado actualizado",
      description: `La reserva ha sido ${
        newStatus === "confirmed" ? "confirmada" : newStatus === "cancelled" ? "cancelada" : "marcada como pendiente"
      }`,
    })

    setShowStatusDialog(false)
  }

  const handleDeleteBooking = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar reservas",
        variant: "destructive",
      })
      return
    }

    setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id))

    toast({
      title: "Reserva eliminada",
      description: "La reserva ha sido eliminada correctamente",
    })

    setShowDeleteDialog(false)
  }

  const openStatusDialog = (booking, status) => {
    setSelectedBooking(booking)
    setNewStatus(status)
    setShowStatusDialog(true)
  }

  const openDeleteDialog = (booking) => {
    setSelectedBooking(booking)
    setShowDeleteDialog(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Confirmada</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700">
            Pendiente
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700">
            Cancelada
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Pagado</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700">
            Pendiente
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
            Reembolsado
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Habitación</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Huésped</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Check-in</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Check-out</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Pago</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">#{booking.id}</td>
                  <td className="p-4 align-middle">{booking.roomNumber}</td>
                  <td className="p-4 align-middle">{booking.guestName}</td>
                  <td className="p-4 align-middle">{booking.checkIn}</td>
                  <td className="p-4 align-middle">{booking.checkOut}</td>
                  <td className="p-4 align-middle">{getStatusBadge(booking.status)}</td>
                  <td className="p-4 align-middle">{getPaymentStatusBadge(booking.paymentStatus)}</td>
                  <td className="p-4 align-middle">${booking.totalAmount}</td>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(booking, "confirmed")}
                          disabled={booking.status === "confirmed" || !isAdmin}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar reserva
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(booking, "pending")}
                          disabled={booking.status === "pending" || !isAdmin}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Marcar como pendiente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(booking, "cancelled")}
                          disabled={booking.status === "cancelled" || !isAdmin}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar reserva
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(booking)}
                          disabled={!isAdmin}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar reserva
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diálogo de confirmación para cambiar estado */}
      {selectedBooking && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newStatus === "confirmed"
                  ? "Confirmar reserva"
                  : newStatus === "cancelled"
                    ? "Cancelar reserva"
                    : "Marcar como pendiente"}
              </DialogTitle>
              <DialogDescription>
                {newStatus === "confirmed"
                  ? "¿Está seguro que desea confirmar esta reserva?"
                  : newStatus === "cancelled"
                    ? "¿Está seguro que desea cancelar esta reserva? Esta acción puede requerir un reembolso."
                    : "¿Está seguro que desea marcar esta reserva como pendiente?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button variant={newStatus === "cancelled" ? "destructive" : "default"} onClick={handleChangeStatus}>
                {newStatus === "confirmed"
                  ? "Confirmar"
                  : newStatus === "cancelled"
                    ? "Cancelar reserva"
                    : "Marcar como pendiente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de confirmación para eliminar */}
      {selectedBooking && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar reserva</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar la reserva #{selectedBooking.id} de {selectedBooking.guestName}? Esta
                acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteBooking}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
