"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { rooms as initialRooms } from "@/lib/data"

export function AdminRoomStatus() {
  const [roomTypes, setRoomTypes] = useState([
    {
      type: "Estándar",
      total: 20,
      occupied: 15,
      maintenance: 2,
      available: 3,
    },
    {
      type: "Deluxe",
      total: 15,
      occupied: 12,
      maintenance: 1,
      available: 2,
    },
    {
      type: "Premium",
      total: 10,
      occupied: 8,
      maintenance: 0,
      available: 2,
    },
    {
      type: "Suite Junior",
      total: 8,
      occupied: 5,
      maintenance: 1,
      available: 2,
    },
    {
      type: "Suite Ejecutiva",
      total: 5,
      occupied: 4,
      maintenance: 0,
      available: 1,
    },
  ])

  // Calcular estadísticas basadas en los datos de habitaciones
  useEffect(() => {
    // Agrupar habitaciones por tipo
    const roomsByType = initialRooms.reduce((acc, room) => {
      const type = room.name.split(" ")[0] // Simplificación para este ejemplo
      if (!acc[type]) {
        acc[type] = {
          type,
          total: 0,
          occupied: 0,
          maintenance: 0,
          available: 0,
        }
      }

      acc[type].total += 1

      if (room.isAvailable) {
        acc[type].available += 1
      } else {
        // Para este ejemplo, asumimos que las no disponibles están ocupadas
        // En un sistema real, tendríamos un estado específico para mantenimiento
        acc[type].occupied += 1
      }

      return acc
    }, {})

    // Convertir a array para renderizar
    const updatedRoomTypes = Object.values(roomsByType)

    if (updatedRoomTypes.length > 0) {
      setRoomTypes(updatedRoomTypes as any)
    }
  }, [])

  return (
    <div className="space-y-4">
      {roomTypes.map((room) => (
        <div key={room.type} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{room.type}</div>
            <div className="text-sm text-muted-foreground">
              {room.occupied} / {room.total} ocupadas
            </div>
          </div>
          <Progress value={(room.occupied / room.total) * 100} />
          <div className="flex gap-2 pt-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
              {room.available} disponibles
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
              {room.occupied} ocupadas
            </Badge>
            {room.maintenance > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700">
                {room.maintenance} en mantenimiento
              </Badge>
            )}
          </div>
        </div>
      ))}
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/rooms")}>
          Ver todas las habitaciones
        </Button>
      </div>
    </div>
  )
}
