import { rooms } from "./data"
import type { Room } from "./types"

export async function getRooms(): Promise<Room[]> {
  // In a real application, this would fetch data from a database or API
  // For this example, we're using static data
  return [...rooms] // Return a copy to avoid mutations
}

export async function getRoomById(id: string): Promise<Room> {
  // En una aplicación real, esto obtendría datos de una base de datos o API
  // Para este ejemplo, estamos usando datos estáticos
  const room = rooms.find((room) => room.id === id)

  if (!room) {
    throw new Error(`Habitación con ID ${id} no encontrada`)
  }

  return room
}

export async function getAvailableRooms(checkIn?: string, checkOut?: string, guests?: number): Promise<Room[]> {
  // En una aplicación real, esto verificaría la disponibilidad en la base de datos
  // Para este ejemplo, filtramos las habitaciones marcadas como disponibles
  let availableRooms = rooms.filter((room) => room.isAvailable)

  // Si se especifica el número de huéspedes, filtrar por capacidad
  if (guests) {
    availableRooms = availableRooms.filter((room) => room.capacity >= guests)
  }

  return availableRooms
}
