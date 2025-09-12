"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, CreditCard, Eye, FileText, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Datos de reservas simulados
const mockReservations = [
  {
    id: "res-001",
    roomId: "deluxe-king",
    roomName: "Habitación Deluxe King",
    checkIn: "2023-12-15",
    checkOut: "2023-12-20",
    guests: 2,
    status: "confirmed",
    totalPrice: 995,
    isPaid: true,
    createdAt: "2023-11-01T10:30:00Z",
  },
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
    createdAt: "2023-11-15T14:45:00Z",
  },
  {
    id: "res-003",
    roomId: "executive-suite",
    roomName: "Suite Ejecutiva",
    checkIn: "2023-10-05",
    checkOut: "2023-10-08",
    guests: 2,
    status: "completed",
    totalPrice: 1047,
    isPaid: true,
    createdAt: "2023-09-20T09:15:00Z",
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
    createdAt: "2023-11-25T16:20:00Z",
  },
  {
    id: "res-005",
    roomId: "standard-queen",
    roomName: "Habitación Estándar Queen",
    checkIn: "2023-09-12",
    checkOut: "2023-09-15",
    guests: 2,
    status: "cancelled",
    totalPrice: 447,
    isPaid: false,
    createdAt: "2023-08-30T11:10:00Z",
  },
  {
    id: "res-006",
    roomId: "deluxe-king",
    roomName: "Habitación Deluxe King",
    checkIn: "2023-08-05",
    checkOut: "2023-08-10",
    guests: 2,
    status: "completed",
    totalPrice: 995,
    isPaid: true,
    createdAt: "2023-07-15T08:30:00Z",
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
    createdAt: "2023-11-30T13:45:00Z",
  },
  {
    id: "res-008",
    roomId: "premium-double",
    roomName: "Habitación Premium Doble",
    checkIn: "2023-07-20",
    checkOut: "2023-07-25",
    guests: 3,
    status: "completed",
    totalPrice: 1245,
    isPaid: true,
    createdAt: "2023-06-10T10:20:00Z",
  },
]

export default function ReservationsList() {
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation)
  }

  const handleCloseDetails = () => {
    setSelectedReservation(null)
  }

  const handleCancelReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowCancelDialog(true)
  }

  const confirmCancelReservation = async () => {
    setIsLoading(true)

    try {
      // En una aplicación real, aquí enviaríamos la solicitud a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cerrar el diálogo y limpiar la selección
      setShowCancelDialog(false)
      setSelectedReservation(null)

      // Mostrar mensaje de éxito
      alert("Reserva cancelada con éxito")
    } catch (error) {
      console.error("Error al cancelar la reserva:", error)
      alert("Error al cancelar la reserva. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmada</span>
        )
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>
        )
      case "cancelled":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelada</span>
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Completada</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Habitación</th>
              <th className="px-4 py-3">Fechas</th>
              <th className="px-4 py-3">Huéspedes</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockReservations.map((reservation) => (
              <tr key={reservation.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{reservation.id}</td>
                <td className="px-4 py-3">{reservation.roomName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>
                      {format(new Date(reservation.checkIn), "dd/MM/yyyy")} -{" "}
                      {format(new Date(reservation.checkOut), "dd/MM/yyyy")}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{reservation.guests}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(reservation.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="font-medium">${reservation.totalPrice}</span>
                    {reservation.isPaid ? (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Pagado
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(reservation)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {!reservation.isPaid && reservation.status === "confirmed" && (
                      <Link href={`/dashboard/payment/${reservation.id}`}>
                        <Button variant="ghost" size="sm">
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    {reservation.status === "confirmed" && (
                      <Button variant="ghost" size="sm" onClick={() => handleCancelReservation(reservation)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles de reserva */}
      {selectedReservation && (
        <Dialog open={!!selectedReservation && !showCancelDialog} onOpenChange={handleCloseDetails}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalles de la Reserva</DialogTitle>
              <DialogDescription>Información completa de su reserva.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID de Reserva</h4>
                  <p>{selectedReservation.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <p>{getStatusBadge(selectedReservation.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Habitación</h4>
                  <p>{selectedReservation.roomName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Huéspedes</h4>
                  <p>{selectedReservation.guests}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Llegada</h4>
                  <p>{format(new Date(selectedReservation.checkIn), "PPP", { locale: es })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Salida</h4>
                  <p>{format(new Date(selectedReservation.checkOut), "PPP", { locale: es })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Precio Total</h4>
                  <p className="font-medium">${selectedReservation.totalPrice}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado de Pago</h4>
                  <p>{selectedReservation.isPaid ? "Pagado" : "Pendiente de pago"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fecha de Reserva</h4>
                  <p>{format(new Date(selectedReservation.createdAt), "PPP", { locale: es })}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseDetails}>
                Cerrar
              </Button>
              {!selectedReservation.isPaid && selectedReservation.status === "confirmed" && (
                <Link href={`/dashboard/payment/${selectedReservation.id}`}>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Realizar Pago
                  </Button>
                </Link>
              )}
              {selectedReservation.isPaid && (
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Factura
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de confirmación de cancelación */}
      {showCancelDialog && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancelar Reserva</DialogTitle>
              <DialogDescription>
                ¿Está seguro de que desea cancelar esta reserva? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Volver
              </Button>
              <Button variant="destructive" onClick={confirmCancelReservation} disabled={isLoading}>
                {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
