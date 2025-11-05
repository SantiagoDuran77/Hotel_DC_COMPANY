import type { Room } from "./types"

const API_BASE_URL = 'http://localhost:5000/api'

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`)
    const data = await response.json()
    
    // Adaptar la respuesta del backend a tu tipo Room
    return data.rooms.map((room: any) => ({
      id: room.id.toString(),
      name: `Habitación ${room.numero}`,
      type: room.tipo,
      price: parseFloat(room.precio),
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: room.estado === 'Disponible',
      image: '/room-placeholder.jpg', // Puedes agregar imágenes después
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    }))
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

export async function getRoomById(id: string): Promise<Room> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`)
    const room = await response.json()

    return {
      id: room.id.toString(),
      name: `Habitación ${room.numero}`,
      type: room.tipo,
      price: parseFloat(room.precio),
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: room.estado === 'Disponible',
      image: '/room-placeholder.jpg',
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    }
  } catch (error) {
    console.error('Error fetching room:', error)
    throw new Error(`Habitación con ID ${id} no encontrada`)
  }
}

export async function getAvailableRooms(checkIn?: string, checkOut?: string, guests?: number): Promise<Room[]> {
  try {
    // Usar el endpoint de disponibilidad del backend
    let url = `${API_BASE_URL}/rooms/availability`
    const params = new URLSearchParams()
    
    if (checkIn) params.append('fecha_inicio', checkIn)
    if (checkOut) params.append('fecha_fin', checkOut)
    if (guests) params.append('huespedes', guests.toString())
    
    if (params.toString()) url += `?${params.toString()}`

    const response = await fetch(url)
    const data = await response.json()

    return data.available_rooms.map((room: any) => ({
      id: room.id.toString(),
      name: `Habitación ${room.numero}`,
      type: room.tipo,
      price: parseFloat(room.precio),
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: true, // Todas las de este endpoint están disponibles
      image: '/room-placeholder.jpg',
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    }))
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    return []
  }
}