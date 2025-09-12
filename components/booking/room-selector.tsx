"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Users, Wifi, Coffee, Tv, Bath, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRooms } from "@/lib/api"
import type { Room } from "@/lib/types"

interface RoomSelectorProps {
  checkIn: Date
  checkOut: Date
  adults: number
  children: number
  onSelectRoom: (roomId: string, roomName: string, roomPrice: number) => void
  selectedRoomId: string
}

export default function RoomSelector({
  checkIn,
  checkOut,
  adults,
  children,
  onSelectRoom,
  selectedRoomId,
}: RoomSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms()
        // Filtrar habitaciones por capacidad
        const totalGuests = adults + children
        const filteredRooms = allRooms.filter((room) => room.capacity >= totalGuests)
        setRooms(filteredRooms)
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [adults, children])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Cargando habitaciones disponibles...</p>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-amber-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">No hay habitaciones disponibles</h3>
        <p className="text-amber-700">
          No se encontraron habitaciones disponibles para las fechas y número de huéspedes seleccionados. Por favor,
          modifique su búsqueda o contacte con el hotel para más información.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">
            {rooms.length} {rooms.length === 1 ? "habitación disponible" : "habitaciones disponibles"}
          </h3>
          <p className="text-sm text-gray-500">
            Para {adults + children} {adults + children === 1 ? "huésped" : "huéspedes"},
            {format(checkIn, "dd MMM", { locale: es })} - {format(checkOut, "dd MMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            Cuadrícula
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            Lista
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`border rounded-lg overflow-hidden ${
                selectedRoomId === room.id ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="relative h-48">
                <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                {selectedRoomId === room.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{room.name}</h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Hasta {room.capacity} huéspedes</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Wi-Fi gratis</Badge>
                  <Badge variant="outline">Desayuno incluido</Badge>
                  <Badge variant="outline">Cancelación gratuita</Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-xl font-bold">${room.price}</span>
                    <span className="text-gray-500"> / noche</span>
                  </div>

                  <Button
                    onClick={() => onSelectRoom(room.id, room.name, room.price)}
                    variant={selectedRoomId === room.id ? "default" : "outline"}
                  >
                    {selectedRoomId === room.id ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`border rounded-lg overflow-hidden ${
                selectedRoomId === room.id ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>

                <div className="md:w-2/3 p-4">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">{room.name}</h3>
                    {selectedRoomId === room.id && <Badge className="bg-primary">Seleccionada</Badge>}
                  </div>

                  <div className="flex items-center text-gray-600 mt-2">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Hasta {room.capacity} huéspedes</span>
                  </div>

                  <p className="text-gray-600 mt-2 line-clamp-2">{room.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm">Wi-Fi gratis</span>
                    </div>
                    <div className="flex items-center">
                      <Coffee className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm">Desayuno</span>
                    </div>
                    <div className="flex items-center">
                      <Tv className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm">TV inteligente</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm">Baño de lujo</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold">${room.price}</span>
                      <span className="text-gray-500"> / noche</span>
                    </div>

                    <Button
                      onClick={() => onSelectRoom(room.id, room.name, room.price)}
                      variant={selectedRoomId === room.id ? "default" : "outline"}
                    >
                      {selectedRoomId === room.id ? "Seleccionada" : "Seleccionar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
