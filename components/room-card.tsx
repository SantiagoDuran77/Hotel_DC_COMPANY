"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ImageCarousel from "@/components/image-carousel"
import type { Room } from "@/lib/types"

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  // Generar múltiples imágenes para el carrusel (en una aplicación real, estas vendrían de la base de datos)
  const roomImages = [
    room.image || "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600&text=Vista+1",
    "/placeholder.svg?height=400&width=600&text=Vista+2",
    "/placeholder.svg?height=400&width=600&text=Baño",
  ]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <ImageCarousel images={roomImages} alt={room.name} aspectRatio="video" showThumbnails={false} />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-medium ${
            room.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {room.isAvailable ? "Disponible" : "No disponible"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>

        <div className="flex items-center text-gray-600 mb-3">
          <Users className="h-5 w-5 mr-2" />
          <span>Hasta {room.capacity} huéspedes</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline">
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && <Badge variant="outline">+{room.amenities.length - 3} más</Badge>}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-900">${room.price}</span>
            <span className="text-gray-600"> / noche</span>
          </div>

          <Link
            href={`/rooms/${room.id}`}
            className={`px-4 py-2 rounded-md transition-colors ${
              room.isAvailable
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            onClick={(e) => !room.isAvailable && e.preventDefault()}
          >
            {room.isAvailable ? "Ver detalles" : "No disponible"}
          </Link>
        </div>
      </div>
    </div>
  )
}
