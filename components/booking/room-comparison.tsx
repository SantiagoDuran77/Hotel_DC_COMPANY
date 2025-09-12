"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRooms } from "@/lib/api"
import type { Room } from "@/lib/types"

export default function RoomComparison() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms()
        setRooms(allRooms)
        // Seleccionar las primeras 3 habitaciones por defecto
        if (allRooms.length > 0) {
          setSelectedRooms(allRooms.slice(0, 3).map((room) => room.id))
        }
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const toggleRoomSelection = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId))
    } else {
      if (selectedRooms.length < 4) {
        setSelectedRooms([...selectedRooms, roomId])
      } else {
        alert("Puede comparar un máximo de 4 habitaciones a la vez.")
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Cargando habitaciones...</p>
      </div>
    )
  }

  // Obtener las habitaciones seleccionadas
  const roomsToCompare = rooms.filter((room) => selectedRooms.includes(room.id))

  // Características para comparar
  const features = [
    {
      id: "size",
      name: "Tamaño",
      values: {
        "deluxe-king": "35 m²",
        "premium-double": "40 m²",
        "executive-suite": "55 m²",
        "family-suite": "70 m²",
        "presidential-suite": "120 m²",
        "standard-queen": "30 m²",
      },
    },
    {
      id: "bed",
      name: "Cama",
      values: {
        "deluxe-king": "King Size",
        "premium-double": "2 Dobles",
        "executive-suite": "King Size",
        "family-suite": "1 King + 2 Individuales",
        "presidential-suite": "King Size de lujo",
        "standard-queen": "Queen Size",
      },
    },
    {
      id: "view",
      name: "Vista",
      values: {
        "deluxe-king": "Ciudad",
        "premium-double": "Jardín",
        "executive-suite": "Ciudad Panorámica",
        "family-suite": "Jardín",
        "presidential-suite": "Panorámica 360°",
        "standard-queen": "Interior",
      },
    },
    {
      id: "bathroom",
      name: "Baño",
      values: {
        "deluxe-king": "Completo con ducha",
        "premium-double": "Completo con bañera",
        "executive-suite": "Completo con bañera y ducha",
        "family-suite": "2 Baños completos",
        "presidential-suite": "Baño de lujo con jacuzzi",
        "standard-queen": "Estándar con ducha",
      },
    },
    {
      id: "wifi",
      name: "Wi-Fi",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": true,
      },
    },
    {
      id: "breakfast",
      name: "Desayuno incluido",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
    {
      id: "minibar",
      name: "Minibar",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
    {
      id: "roomService",
      name: "Servicio a la habitación",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
    {
      id: "tv",
      name: "TV",
      values: {
        "deluxe-king": 'Smart TV 42"',
        "premium-double": 'Smart TV 50"',
        "executive-suite": 'Smart TV 55"',
        "family-suite": '2 Smart TV 50"',
        "presidential-suite": 'Smart TV 65" + Home Theater',
        "standard-queen": 'TV 32"',
      },
    },
    {
      id: "airConditioning",
      name: "Aire acondicionado",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": true,
      },
    },
    {
      id: "workspace",
      name: "Espacio de trabajo",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
    {
      id: "coffeeMaker",
      name: "Cafetera",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
    {
      id: "safe",
      name: "Caja fuerte",
      values: {
        "deluxe-king": true,
        "premium-double": true,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": true,
      },
    },
    {
      id: "livingRoom",
      name: "Sala de estar",
      values: {
        "deluxe-king": false,
        "premium-double": false,
        "executive-suite": true,
        "family-suite": true,
        "presidential-suite": true,
        "standard-queen": false,
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Seleccione habitaciones para comparar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`border rounded-md p-2 cursor-pointer ${
                  selectedRooms.includes(room.id) ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleRoomSelection(room.id)}
              >
                <div className="relative h-20 mb-2">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <p className="text-xs font-medium truncate">{room.name}</p>
                <p className="text-xs text-gray-500">${room.price}/noche</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedRooms.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 border-b"></th>
                {roomsToCompare.map((room) => (
                  <th key={room.id} className="p-3 bg-gray-50 border-b min-w-[200px]">
                    <div className="space-y-2">
                      <div className="relative h-32 w-full">
                        <Image
                          src={room.image || "/placeholder.svg"}
                          alt={room.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-xl font-bold">
                        ${room.price}
                        <span className="text-sm font-normal">/noche</span>
                      </p>
                      <Button size="sm" className="w-full">
                        Reservar
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b font-medium">Capacidad</td>
                {roomsToCompare.map((room) => (
                  <td key={room.id} className="p-3 border-b text-center">
                    {room.capacity} personas
                  </td>
                ))}
              </tr>

              {features.map((feature) => (
                <tr key={feature.id}>
                  <td className="p-3 border-b font-medium">{feature.name}</td>
                  {roomsToCompare.map((room) => (
                    <td key={room.id} className="p-3 border-b text-center">
                      {typeof feature.values[room.id as keyof typeof feature.values] === "boolean" ? (
                        feature.values[room.id as keyof typeof feature.values] ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        feature.values[room.id as keyof typeof feature.values]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p>Seleccione al menos una habitación para comparar</p>
        </div>
      )}
    </div>
  )
}
