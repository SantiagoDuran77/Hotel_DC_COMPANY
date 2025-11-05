import type { Room, Service } from "./types"

const API_BASE_URL = 'http://localhost:5000/api'

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`)
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('📋 Rooms data from API:', data)
    
    // Adaptar la respuesta del backend a tu tipo Room
    return data.rooms?.map((room: any) => ({
      id: room.id_habitacion?.toString() || room.id?.toString() || '',
      name: `Habitación ${room.numero_habitacion || room.numero || 'N/A'}`,
      type: room.tipo_habitacion || room.tipo || 'Sencilla',
      price: parseFloat(room.precio) || 0,
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: room.estado_habitacion === 'Disponible' || room.estado === 'Disponible',
      image: '/room-placeholder.jpg',
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    })) || []
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

export async function getRoomById(id: string): Promise<Room> {
  try {
    console.log(`🔍 Fetching room with ID: ${id}`)
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Habitación con ID ${id} no encontrada en el servidor`)
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const roomData = await response.json()
    
    console.log('📋 Room data from API:', roomData)

    if (!roomData.room && !roomData.id) {
      throw new Error(`Habitación con ID ${id} no existe en la respuesta`)
    }

    const room = roomData.room || roomData

    return {
      id: room.id_habitacion?.toString() || room.id?.toString() || id,
      name: `Habitación ${room.numero_habitacion || room.numero || 'N/A'}`,
      type: room.tipo_habitacion || room.tipo || 'Sencilla',
      price: parseFloat(room.precio) || 0,
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: room.estado_habitacion === 'Disponible' || room.estado === 'Disponible',
      image: '/room-placeholder.jpg',
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    }
  } catch (error) {
    console.error('Error fetching room:', error)
    throw new Error(`Habitación con ID ${id} no encontrada: ${error.message}`)
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

    console.log('🔍 Fetching available rooms from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()

    console.log('📋 Available rooms data:', data)

    return data.available_rooms?.map((room: any) => ({
      id: room.id_habitacion?.toString() || room.id?.toString() || '',
      name: `Habitación ${room.numero_habitacion || room.numero || 'N/A'}`,
      type: room.tipo_habitacion || room.tipo || 'Sencilla',
      price: parseFloat(room.precio) || 0,
      capacity: room.capacidad || 2,
      description: room.descripcion || '',
      isAvailable: true,
      image: '/room-placeholder.jpg',
      amenities: room.servicios_incluidos ? room.servicios_incluidos.split(', ') : []
    })) || []
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    return []
  }
}

// SERVICIOS REALES - NUEVAS FUNCIONES
export async function getServices(): Promise<Service[]> {
  try {
    console.log('🔄 Fetching services from backend...')
    const response = await fetch(`${API_BASE_URL}/services`)
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('✅ Services fetched successfully:', data.services?.length || 0)
    
    return data.services?.map((service: any) => ({
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      price: parseFloat(service.price),
      category: getServiceCategory(service.name),
      image: '/service-placeholder.jpg'
    })) || []
  } catch (error) {
    console.error('❌ Error fetching services:', error)
    return []
  }
}

export async function getServiceById(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`)
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const service = await response.json()

    return {
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      price: parseFloat(service.price),
      category: getServiceCategory(service.name),
      image: '/service-placeholder.jpg'
    }
  } catch (error) {
    console.error('Error fetching service:', error)
    throw new Error(`Servicio con ID ${id} no encontrado: ${error.message}`)
  }
}

export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const allServices = await getServices()
    // Retornar los primeros 6 servicios como destacados
    return allServices.slice(0, 6)
  } catch (error) {
    console.error('Error fetching featured services:', error)
    return []
  }
}

// Categorizar servicios automáticamente
function getServiceCategory(serviceName: string): string {
  const name = serviceName.toLowerCase()
  
  if (name.includes('desayuno') || name.includes('almuerzo') || name.includes('cena')) {
    return 'Alimentación'
  } else if (name.includes('spa') || name.includes('masaje')) {
    return 'Bienestar'
  } else if (name.includes('transporte') || name.includes('tour')) {
    return 'Transporte'
  } else if (name.includes('lavandería') || name.includes('limpieza') || name.includes('lavanderia')) {
    return 'Limpieza'
  } else if (name.includes('llamada') || name.includes('internet') || name.includes('wifi')) {
    return 'Comunicaciones'
  } else if (name.includes('gimnasio') || name.includes('piscina')) {
    return 'Recreación'
  } else {
    return 'Otros'
  }
}