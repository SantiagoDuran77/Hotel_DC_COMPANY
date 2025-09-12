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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import * as authUtils from "@/lib/auth"

export function AdminRoomsTable() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState([
    {
      id: "r1",
      number: "101",
      floor: 1,
      type: "standard",
      capacity: 2,
      price: 120,
      available: true,
      status: "clean",
      features: ["TV", "WiFi", "Aire acondicionado"],
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "r2",
      number: "102",
      floor: 1,
      type: "standard",
      capacity: 2,
      price: 120,
      available: true,
      status: "clean",
      features: ["TV", "WiFi", "Aire acondicionado"],
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "r3",
      number: "201",
      floor: 2,
      type: "suite",
      capacity: 4,
      price: 250,
      available: true,
      status: "clean",
      features: ["TV", "WiFi", "Aire acondicionado", "Minibar", "Jacuzzi"],
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "r4",
      number: "202",
      floor: 2,
      type: "deluxe",
      capacity: 3,
      price: 180,
      available: false,
      status: "maintenance",
      features: ["TV", "WiFi", "Aire acondicionado", "Minibar"],
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "r5",
      number: "301",
      floor: 3,
      type: "presidential",
      capacity: 6,
      price: 500,
      available: true,
      status: "clean",
      features: ["TV", "WiFi", "Aire acondicionado", "Minibar", "Jacuzzi", "Terraza"],
      image: "/placeholder.svg?height=100&width=200",
    },
  ])

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newRoom, setNewRoom] = useState({
    number: "",
    floor: 1,
    type: "standard",
    capacity: 2,
    price: 120,
    available: true,
    status: "clean",
    features: ["TV", "WiFi", "Aire acondicionado"],
    image: "/placeholder.svg?height=100&width=200",
  })

  const currentUser = authUtils.getCurrentUser()
  const isAdmin = authUtils.isAdmin(currentUser)

  const handleToggleAvailability = (roomId) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar la disponibilidad de las habitaciones",
        variant: "destructive",
      })
      return
    }

    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          const newAvailability = !room.available
          toast({
            title: "Disponibilidad actualizada",
            description: `Habitación ${room.number} ${newAvailability ? "disponible" : "no disponible"}`,
          })
          return { ...room, available: newAvailability }
        }
        return room
      }),
    )
  }

  const handleDeleteRoom = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar habitaciones",
        variant: "destructive",
      })
      return
    }

    setRooms(rooms.filter((room) => room.id !== selectedRoom.id))
    toast({
      title: "Habitación eliminada",
      description: `La habitación ${selectedRoom.number} ha sido eliminada correctamente`,
    })
    setShowDeleteDialog(false)
  }

  const handleEditRoom = (updatedRoom) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden editar habitaciones",
        variant: "destructive",
      })
      return
    }

    setRooms(
      rooms.map((room) => {
        if (room.id === selectedRoom.id) {
          return { ...room, ...updatedRoom }
        }
        return room
      }),
    )
    toast({
      title: "Habitación actualizada",
      description: `La habitación ${selectedRoom.number} ha sido actualizada correctamente`,
    })
    setShowEditDialog(false)
  }

  const handleAddRoom = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden añadir habitaciones",
        variant: "destructive",
      })
      return
    }

    const newId = `r${rooms.length + 1}`
    setRooms([...rooms, { ...newRoom, id: newId }])
    toast({
      title: "Habitación añadida",
      description: `La habitación ${newRoom.number} ha sido añadida correctamente`,
    })
    setShowAddDialog(false)
    setNewRoom({
      number: "",
      floor: 1,
      type: "standard",
      capacity: 2,
      price: 120,
      available: true,
      status: "clean",
      features: ["TV", "WiFi", "Aire acondicionado"],
      image: "/placeholder.svg?height=100&width=200",
    })
  }

  const openDeleteDialog = (room) => {
    setSelectedRoom(room)
    setShowDeleteDialog(true)
  }

  const openEditDialog = (room) => {
    setSelectedRoom(room)
    setShowEditDialog(true)
  }

  const getRoomTypeLabel = (type) => {
    switch (type) {
      case "standard":
        return "Estándar"
      case "deluxe":
        return "Deluxe"
      case "suite":
        return "Suite"
      case "presidential":
        return "Presidencial"
      default:
        return type
    }
  }

  const getRoomStatusLabel = (status) => {
    switch (status) {
      case "clean":
        return "Limpia"
      case "dirty":
        return "Sucia"
      case "maintenance":
        return "Mantenimiento"
      default:
        return status
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Habitaciones</h2>
        <Button onClick={() => setShowAddDialog(true)} disabled={!isAdmin}>
          Añadir Habitación
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Habitación</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Capacidad</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Precio</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Disponible</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={`Habitación ${room.number}`}
                        className="h-10 w-16 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">#{room.number}</div>
                        <div className="text-xs text-muted-foreground">Piso {room.floor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{getRoomTypeLabel(room.type)}</Badge>
                  </td>
                  <td className="p-4 align-middle">{room.capacity} personas</td>
                  <td className="p-4 align-middle">${room.price}/noche</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        room.status === "clean" ? "default" : room.status === "dirty" ? "secondary" : "destructive"
                      }
                      className={
                        room.status === "clean"
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : room.status === "dirty"
                            ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700"
                            : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                      }
                    >
                      {getRoomStatusLabel(room.status)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Switch
                      checked={room.available}
                      onCheckedChange={() => handleToggleAvailability(room.id)}
                      disabled={!isAdmin}
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
                        <DropdownMenuItem onClick={() => openEditDialog(room)} disabled={!isAdmin}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar habitación
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(room)}
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

      {/* Diálogo de confirmación para eliminar */}
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
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoom}>
                Eliminar
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
              <DialogTitle>Editar habitación</DialogTitle>
              <DialogDescription>
                Modifique los datos de la habitación y haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-number" className="text-right">
                  Número
                </Label>
                <Input id="room-number" defaultValue={selectedRoom.number} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-floor" className="text-right">
                  Piso
                </Label>
                <Input id="room-floor" type="number" defaultValue={selectedRoom.floor} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-type" className="text-right">
                  Tipo
                </Label>
                <select
                  id="room-type"
                  defaultValue={selectedRoom.type}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="standard">Estándar</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidencial</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-capacity" className="text-right">
                  Capacidad
                </Label>
                <Input id="room-capacity" type="number" defaultValue={selectedRoom.capacity} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-price" className="text-right">
                  Precio
                </Label>
                <Input id="room-price" type="number" defaultValue={selectedRoom.price} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-status" className="text-right">
                  Estado
                </Label>
                <select
                  id="room-status"
                  defaultValue={selectedRoom.status}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="clean">Limpia</option>
                  <option value="dirty">Sucia</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Disponible</Label>
                <div className="col-span-3">
                  <Switch defaultChecked={selectedRoom.available} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const updatedRoom = {
                    number: document.getElementById("room-number").value,
                    floor: Number.parseInt(document.getElementById("room-floor").value),
                    type: document.getElementById("room-type").value,
                    capacity: Number.parseInt(document.getElementById("room-capacity").value),
                    price: Number.parseFloat(document.getElementById("room-price").value),
                    status: document.getElementById("room-status").value,
                    available: document.querySelector('button[role="switch"]').getAttribute("data-state") === "checked",
                  }
                  handleEditRoom(updatedRoom)
                }}
              >
                Guardar cambios
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
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-floor" className="text-right">
                Piso
              </Label>
              <Input
                id="new-room-floor"
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-type" className="text-right">
                Tipo
              </Label>
              <select
                id="new-room-type"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="standard">Estándar</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidencial</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-capacity" className="text-right">
                Capacidad
              </Label>
              <Input
                id="new-room-capacity"
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: Number.parseInt(e.target.value) })}
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
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-room-status" className="text-right">
                Estado
              </Label>
              <select
                id="new-room-status"
                value={newRoom.status}
                onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="clean">Limpia</option>
                <option value="dirty">Sucia</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Disponible</Label>
              <div className="col-span-3">
                <Switch
                  checked={newRoom.available}
                  onCheckedChange={(checked) => setNewRoom({ ...newRoom, available: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRoom}>Añadir habitación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
