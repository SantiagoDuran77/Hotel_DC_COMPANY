"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Trash2, Eye, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { isCurrentUserAdmin, getReservations, updateReservationStatus, deleteReservation } from "@/lib/api"

interface Reservation {
  id: string
  booking_date: string
  start_date: string
  end_date: string
  status: string
  client: {
    name: string
    email: string
    phone: string
  }
  room: {
    number: string
    type: string
    price: number
  }
  details: {
    total_cost: number
    checkin?: string
    checkout?: string
  }
  employee?: string
}

export function AdminBookingsTable() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const isAdmin = isCurrentUserAdmin()

  // Cargar reservas
  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando reservas...')
      
      const reservationsData = await getReservations()
      console.log(`✅ ${reservationsData.length} reservas cargadas`)
      setReservations(reservationsData)
      
    } catch (error) {
      console.error('❌ Error al cargar reservas:', error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `No se pudieron cargar las reservas: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  // Cambiar estado de reserva
  const handleChangeStatus = async () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar el estado de las reservas",
        variant: "destructive",
      })
      return
    }

    try {
      if (!selectedReservation) return

      await updateReservationStatus(selectedReservation.id, newStatus)
      await loadReservations()
      
      toast({
        title: "Estado actualizado",
        description: `La reserva ha sido ${getStatusText(newStatus)}`,
      })
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la reserva",
        variant: "destructive",
      })
    }

    setShowStatusDialog(false)
  }

  // Eliminar reserva
  const handleDeleteReservation = async () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar reservas",
        variant: "destructive",
      })
      return
    }

    try {
      if (!selectedReservation) return

      await deleteReservation(selectedReservation.id)
      await loadReservations()
      
      toast({
        title: "Reserva eliminada",
        description: "La reserva ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error('❌ Error al eliminar reserva:', error)
      toast({
        title: "Error",
        description: "Error al eliminar la reserva",
        variant: "destructive",
      })
    }

    setShowDeleteDialog(false)
  }

  const openStatusDialog = (reservation: Reservation, status: string) => {
    setSelectedReservation(reservation)
    setNewStatus(status)
    setShowStatusDialog(true)
  }

  const openDeleteDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDeleteDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmada":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">Confirmada</Badge>
      case "Pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700">
            Pendiente
          </Badge>
        )
      case "Cancelada":
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700">
            Cancelada
          </Badge>
        )
      case "Completada":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
            Completada
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "confirmada"
      case "Pendiente":
        return "marcada como pendiente"
      case "Cancelada":
        return "cancelada"
      case "Completada":
        return "completada"
      default:
        return status.toLowerCase()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p>Cargando reservas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-600 mb-4">
          <p className="font-semibold">Error al cargar reservas</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={loadReservations} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Reservas</h1>
          <p className="text-muted-foreground">
            {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>
        <Button onClick={loadReservations} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

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
                <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">#{reservation.id}</td>
                  <td className="p-4 align-middle">
                    <div>
                      <div className="font-medium">Habitación {reservation.room.number}</div>
                      <div className="text-xs text-muted-foreground">{reservation.room.type}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div>
                      <div className="font-medium">{reservation.client.name}</div>
                      <div className="text-xs text-muted-foreground">{reservation.client.email}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{formatDate(reservation.start_date)}</td>
                  <td className="p-4 align-middle">{formatDate(reservation.end_date)}</td>
                  <td className="p-4 align-middle">{getStatusBadge(reservation.status)}</td>
                  <td className="p-4 align-middle font-medium">
                    {formatCurrency(reservation.details.total_cost || 0)}
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(reservation, "Confirmada")}
                          disabled={reservation.status === "Confirmada" || !isAdmin}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar reserva
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(reservation, "Pendiente")}
                          disabled={reservation.status === "Pendiente" || !isAdmin}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Marcar como pendiente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(reservation, "Completada")}
                          disabled={reservation.status === "Completada" || !isAdmin}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como completada
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(reservation, "Cancelada")}
                          disabled={reservation.status === "Cancelada" || !isAdmin}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar reserva
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(reservation)}
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
          {reservations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No hay reservas registradas
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación para cambiar estado */}
      {selectedReservation && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newStatus === "Confirmada"
                  ? "Confirmar reserva"
                  : newStatus === "Cancelada"
                    ? "Cancelar reserva"
                    : newStatus === "Completada"
                      ? "Marcar como completada"
                      : "Marcar como pendiente"}
              </DialogTitle>
              <DialogDescription>
                {newStatus === "Confirmada"
                  ? `¿Está seguro que desea confirmar la reserva #${selectedReservation.id} de ${selectedReservation.client.name}?`
                  : newStatus === "Cancelada"
                    ? `¿Está seguro que desea cancelar la reserva #${selectedReservation.id} de ${selectedReservation.client.name}? Esta acción puede requerir un reembolso.`
                    : newStatus === "Completada"
                      ? `¿Está seguro que desea marcar como completada la reserva #${selectedReservation.id} de ${selectedReservation.client.name}?`
                      : `¿Está seguro que desea marcar como pendiente la reserva #${selectedReservation.id} de ${selectedReservation.client.name}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant={newStatus === "Cancelada" ? "destructive" : "default"} 
                onClick={handleChangeStatus}
              >
                {newStatus === "Confirmada"
                  ? "Confirmar"
                  : newStatus === "Cancelada"
                    ? "Cancelar reserva"
                    : newStatus === "Completada"
                      ? "Marcar como completada"
                      : "Marcar como pendiente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de confirmación para eliminar */}
      {selectedReservation && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar reserva</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar la reserva #{selectedReservation.id} de {selectedReservation.client.name}? 
                Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteReservation}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}