// components/admin/admin-rooms-table.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Edit, MoreHorizontal, Trash2, Eye, Loader2, PlusCircle } from "lucide-react"
import { authUtils } from "@/lib/utils/authUtils"
import { type Room, type DatabaseRoom } from "@/lib/api"

interface AdminRoomsTableProps {
  rooms: Room[]
  isLoading?: boolean
  onUpdateRoom?: (id: string, roomData: Partial<DatabaseRoom>) => Promise<void>
  onDeleteRoom?: (id: string) => Promise<void>
  onCreateRoom?: (roomData: Omit<DatabaseRoom, 'id_habitacion'>) => Promise<Room>
  onReload?: () => void
  isAdmin?: boolean
}

export function AdminRoomsTable({ 
  rooms: externalRooms, 
  isLoading = false,
  onUpdateRoom,
  onDeleteRoom,
  onCreateRoom,
  onReload,
  isAdmin = false
}: AdminRoomsTableProps) {
  const { toast } = useToast()
  const [internalRooms, setInternalRooms] = useState<Room[]>(externalRooms)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newRoom, setNewRoom] = useState({
    numero_habitacion: 0,
    tipo_habitacion: "Sencilla" as 'Sencilla' | 'Doble' | 'Suite',
    precio: 150000,
    estado_habitacion: "Disponible" as 'Disponible' | 'Ocupada' | 'Mantenimiento',
    capacidad: 2,
    descripcion: "",
    servicios_incluidos: "WiFi, TV, Aire acondicionado"
  })

  // Sincronizar con las props externas
  useEffect(() => {
    setInternalRooms(externalRooms)
  }, [externalRooms])

  // Escuchar evento para abrir modal de agregar
  useEffect(() => {
    const handleOpenAddModal = () => {
      if (isAdmin) {
        setShowAddDialog(true)
      }
    }

    window.addEventListener('openAddRoomModal', handleOpenAddModal)
    return () => {
      window.removeEventListener('openAddRoomModal', handleOpenAddModal)
    }
  }, [isAdmin])

  const currentUser = authUtils.getCurrentUser()

  const handleToggleAvailability = async (roomId: string, currentEstado: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar la disponibilidad de las habitaciones",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      const newEstado = currentEstado === 'Disponible' ? 'Ocupada' : 'Disponible'
      
      if (onUpdateRoom) {
        await onUpdateRoom(roomId, { estado_habitacion: newEstado })
      }

      toast({
        title: "Disponibilidad actualizada",
        description: `Habitación ${roomId} ${newEstado === 'Disponible' ? "disponible" : "no disponible"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la disponibilidad",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!isAdmin || !selectedRoom) return

    try {
      setIsProcessing(true)
      
      if (onDeleteRoom) {
        await onDeleteRoom(selectedRoom.id)
      }

      toast({
        title: "Habitación eliminada",
        description: `La habitación ${selectedRoom.number} ha sido eliminada correctamente`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la habitación",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditRoom = async () => {
    if (!isAdmin || !selectedRoom) return

    try {
      setIsProcessing(true)
      const updatedRoom = {
        numero_habitacion: parseInt(selectedRoom.number),
        tipo_habitacion: selectedRoom.tipo,
        precio: selectedRoom.precio,
        estado_habitacion: selectedRoom.estado,
        capacidad: selectedRoom.capacidad,
        descripcion: selectedRoom.descripcion,
        servicios_incluidos: selectedRoom.servicios_incluidos
      }

      if (onUpdateRoom) {
        await onUpdateRoom(selectedRoom.id, updatedRoom)
      }

      toast({
        title: "Habitación actualizada",
        description: `La habitación ${selectedRoom.number} ha sido actualizada correctamente`,
      })
      setShowEditDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la habitación",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddRoom = async () => {
    if (!isAdmin || !onCreateRoom) return

    try {
      setIsProcessing(true)

      await onCreateRoom(newRoom)

      toast({
        title: "Habitación añadida",
        description: `La habitación ${newRoom.numero_habitacion} ha sido añadida correctamente`,
      })
      setShowAddDialog(false)
      setNewRoom({
        numero_habitacion: 0,
        tipo_habitacion: "Sencilla",
        precio: 150000,
        estado_habitacion: "Disponible",
        capacidad: 2,
        descripcion: "",
        servicios_incluidos: "WiFi, TV, Aire acondicionado"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la habitación",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case "Sencilla":
        return "Sencilla"
      case "Doble":
        return "Doble"
      case "Suite":
        return "Suite"
      default:
        return type
    }
  }

  const getRoomStatusLabel = (status: string) => {
    switch (status) {
      case "Disponible":
        return "Disponible"
      case "Ocupada":
        return "Ocupada"
      case "Mantenimiento":
        return "Mantenimiento"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Disponible":
        return "default"
      case "Ocupada":
        return "secondary"
      case "Mantenimiento":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando habitaciones...</span>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Número</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Capacidad</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Precio/Noche</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Disponible</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {internalRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="font-medium">#{room.number}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{getRoomTypeLabel(room.tipo)}</Badge>
                  </td>
                  <td className="p-4 align-middle">{room.capacidad} personas</td>
                  <td className="p-4 align-middle">{formatPrice(room.precio)}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={getStatusVariant(room.estado)}>
                      {getRoomStatusLabel(room.estado)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Switch
                      checked={room.estado === 'Disponible'}
                      onCheckedChange={() => handleToggleAvailability(room.id, room.estado)}
                      disabled={!isAdmin || isProcessing}
                    />
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
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedRoom(room)
                            setShowEditDialog(true)
                          }} 
                          disabled={!isAdmin}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar habitación
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedRoom(room)
                            setShowDeleteDialog(true)
                          }}
                          disabled={!isAdmin}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar habitación
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

      {/* Diálogos */}
      {selectedRoom && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar habitación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar la habitación {selectedRoom.number}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoom} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para editar habitación */}
      {selectedRoom && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar habitación #{selectedRoom.number}</DialogTitle>
              <DialogDescription>
                Modifique los datos de la habitación y haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-number" className="text-right">
                  Número
                </Label>
                <Input 
                  id="room-number" 
                  value={selectedRoom.number}
                  onChange={(e) => setSelectedRoom({...selectedRoom, number: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-type" className="text-right">
                  Tipo
                </Label>
                <select
                  id="room-type"
                  value={selectedRoom.tipo}
                  onChange={(e) => setSelectedRoom({...selectedRoom, tipo: e.target.value as any})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Sencilla">Sencilla</option>
                  <option value="Doble">Doble</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-capacity" className="text-right">
                  Capacidad
                </Label>
                <Input 
                  id="room-capacity" 
                  type="number" 
                  value={selectedRoom.capacidad}
                  onChange={(e) => setSelectedRoom({...selectedRoom, capacidad: parseInt(e.target.value)})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-price" className="text-right">
                  Precio
                </Label>
                <Input 
                  id="room-price" 
                  type="number" 
                  value={selectedRoom.precio}
                  onChange={(e) => setSelectedRoom({...selectedRoom, precio: parseFloat(e.target.value)})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-status" className="text-right">
                  Estado
                </Label>
                <select
                  id="room-status"
                  value={selectedRoom.estado}
                  onChange={(e) => setSelectedRoom({...selectedRoom, estado: e.target.value as any})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupada">Ocupada</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button onClick={handleEditRoom} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para añadir habitación */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir habitación</DialogTitle>
            <DialogDescription>
              Introduzca los datos de la nueva habitación y haga clic en añadir cuando termine.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-number" className="text-right">
                Número
              </Label>
              <Input
                id="new-room-number"
                type="number"
                value={newRoom.numero_habitacion || ''}
                onChange={(e) => setNewRoom({ ...newRoom, numero_habitacion: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="101"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-type" className="text-right">
                Tipo
              </Label>
              <select
                id="new-room-type"
                value={newRoom.tipo_habitacion}
                onChange={(e) => setNewRoom({ ...newRoom, tipo_habitacion: e.target.value as any })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Sencilla">Sencilla</option>
                <option value="Doble">Doble</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-capacity" className="text-right">
                Capacidad
              </Label>
              <Input
                id="new-room-capacity"
                type="number"
                value={newRoom.capacidad}
                onChange={(e) => setNewRoom({ ...newRoom, capacidad: parseInt(e.target.value) || 2 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-price" className="text-right">
                Precio
              </Label>
              <Input
                id="new-room-price"
                type="number"
                value={newRoom.precio}
                onChange={(e) => setNewRoom({ ...newRoom, precio: parseFloat(e.target.value) || 150000 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-status" className="text-right">
                Estado
              </Label>
              <select
                id="new-room-status"
                value={newRoom.estado_habitacion}
                onChange={(e) => setNewRoom({ ...newRoom, estado_habitacion: e.target.value as any })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupada">Ocupada</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button onClick={handleAddRoom} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Añadir habitación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}