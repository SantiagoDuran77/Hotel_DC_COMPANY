"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Users, CreditCard, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getRooms } from "@/lib/api"
import type { Room } from "@/lib/types"
import ImageCarousel from "./image-carousel"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { toast } from "react-hot-toast"

interface RoomSelectorCinemaProps {
  onSelectRoom?: (room: Room) => void
  selectedRoomId?: string
}

export default function RoomSelectorCinema({ onSelectRoom, selectedRoomId }: RoomSelectorCinemaProps) {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showRoomDetails, setShowRoomDetails] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Verificar el usuario actual
  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  // Cargar habitaciones
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const allRooms = await getRooms()

        // Ordenar habitaciones por piso y número
        const sortedRooms = [...allRooms].sort((a, b) => {
          // Primero ordenar por piso
          if (a.floor !== b.floor) {
            return a.floor - b.floor
          }
          // Luego ordenar por número de habitación
          return a.roomNumber - b.roomNumber
        })

        setRooms(sortedRooms)
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Agrupar habitaciones por piso
  const roomsByFloor = rooms.reduce(
    (acc, room) => {
      const floor = room.floor || 1
      if (!acc[floor]) {
        acc[floor] = []
      }
      acc[floor].push(room)
      return acc
    },
    {} as Record<number, Room[]>,
  )

  // Ordenar pisos de menor a mayor (más natural)
  const sortedFloors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => a - b)

  const handleRoomClick = (room: Room) => {
    // Ahora permitimos hacer clic en cualquier habitación para ver detalles
    setSelectedRoom(room)
    setShowRoomDetails(true)
  }

  const handleSelectRoom = () => {
    if (selectedRoom && onSelectRoom && selectedRoom.isAvailable) {
      onSelectRoom(selectedRoom)
      setShowRoomDetails(false)
    }
  }

  const handleBookNow = () => {
    if (selectedRoom && selectedRoom.isAvailable) {
      router.push(`/rooms/${selectedRoom.id}`)
    }
  }

  const toggleAvailability = async (roomId: string) => {
    // Solo permitir a administradores cambiar la disponibilidad
    if (!isAdmin(currentUser)) {
      toast.error("No tienes permisos para realizar esta acción.")
      return
    }

    try {
      // Optimistically update the UI
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === roomId ? { ...room, isAvailable: !room.isAvailable } : room)),
      )

      // Si estamos cambiando la disponibilidad de la habitación seleccionada,
      // actualizamos también el estado selectedRoom
      if (selectedRoom && selectedRoom.id === roomId) {
        setSelectedRoom((prev) => (prev ? { ...prev, isAvailable: !prev.isAvailable } : null))
      }

      // TODO: Call your API endpoint to update the room availability in the database
      // await updateRoomAvailability(roomId, !selectedRoom.isAvailable);

      toast.success(`Habitación ${roomId} marcada como ${selectedRoom?.isAvailable ? "disponible" : "no disponible"}.`)
    } catch (error) {
      console.error("Error al cambiar la disponibilidad de la habitación:", error)
      toast.error("Hubo un error al cambiar la disponibilidad de la habitación.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Seleccione su Habitación</h2>
        <p className="text-gray-600">Haga clic en una habitación para ver detalles y reservar</p>

        <div className="flex justify-center items-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
            <span className="text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
            <span className="text-sm">No Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm bg-blue-500 mr-2"></div>
            <span className="text-sm">Seleccionada</span>
          </div>
        </div>
      </div>

      {/* Habitaciones por piso */}
      <div className="space-y-12">
        {sortedFloors.map((floor) => (
          <div key={floor} className="space-y-2">
            <h3 className="text-lg font-semibold">Piso {floor}</h3>
            <div className="grid grid-cols-5 gap-4">
              {roomsByFloor[floor].map((room) => (
                <TooltipProvider key={room.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`relative w-full aspect-square rounded-md flex flex-col items-center justify-center text-white font-medium transition-all ${
                          selectedRoomId === room.id
                            ? "bg-blue-500 scale-105 shadow-lg"
                            : room.isAvailable
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                        }`}
                        onClick={() => handleRoomClick(room)}
                      >
                        <span className="text-lg">{room.roomNumber}</span>
                        <span className="text-xs mt-1">{room.bedType}</span>
                        {selectedRoomId === room.id && (
                          <div className="absolute top-1 right-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 text-xs">
                          {room.isAvailable ? "Disponible" : "Ocupada"}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs">
                          {room.bedType} - Vista {room.view}
                        </p>
                        <p className="text-xs">Capacidad: {room.capacity} personas</p>
                        <p className="font-medium">${room.price} / noche</p>
                        <p className={`text-xs ${room.isAvailable ? "text-green-500" : "text-red-500"}`}>
                          {room.isAvailable ? "Disponible" : "No disponible"}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles de habitación */}
      <Dialog open={showRoomDetails} onOpenChange={setShowRoomDetails}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.name}</DialogTitle>
            <DialogDescription>
              Habitación {selectedRoom?.roomNumber} - Piso {selectedRoom?.floor}
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ImageCarousel
                  images={selectedRoom.images || [selectedRoom.image]}
                  alt={selectedRoom.name}
                  aspectRatio="square"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Detalles</h3>
                  <p className="text-sm text-gray-600">{selectedRoom.description}</p>
                </div>

                <div>
                  <h3 className="font-medium">Características</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">{selectedRoom.bedType}</Badge>
                    <Badge variant="outline">Vista {selectedRoom.view}</Badge>
                    <Badge variant="outline">Piso {selectedRoom.floor}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Comodidades</h3>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Capacidad para {selectedRoom.capacity} personas</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">Estado:</span>
                    <Badge className={selectedRoom.isAvailable ? "bg-green-500" : "bg-red-500"}>
                      {selectedRoom.isAvailable ? "Disponible" : "No disponible"}
                    </Badge>
                  </div>
                  {isAdmin(currentUser) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(selectedRoom.id)}
                      className="flex items-center"
                    >
                      {selectedRoom.isAvailable ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1 text-green-500" />
                          Marcar como ocupada
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1 text-red-500" />
                          Marcar como disponible
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold">${selectedRoom.price}</span>
                      <span className="text-gray-500"> / noche</span>
                    </div>

                    {onSelectRoom ? (
                      <Button onClick={handleSelectRoom} disabled={!selectedRoom.isAvailable}>
                        {!selectedRoom.isAvailable ? "No disponible" : "Seleccionar"}
                      </Button>
                    ) : (
                      <Button onClick={handleBookNow} disabled={!selectedRoom.isAvailable}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {!selectedRoom.isAvailable ? "No disponible" : "Reservar Ahora"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
