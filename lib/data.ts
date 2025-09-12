import type { Room } from "./types"

// Función para generar habitaciones organizadas por piso
const generateRooms = (): Room[] => {
  const roomTypes = [
    {
      prefix: "Estándar",
      priceRange: [99, 149],
      capacityRange: [1, 2],
      description: "Habitación cómoda y funcional con todas las comodidades esenciales para una estancia agradable.",
      amenities: ["Wi-Fi gratis", "TV de pantalla plana", "Aire acondicionado", "Cafetera"],
    },
    {
      prefix: "Deluxe",
      priceRange: [149, 249],
      capacityRange: [2, 3],
      description:
        "Espaciosa habitación con cama king-size, comodidades modernas y una impresionante vista de la ciudad.",
      amenities: ["Wi-Fi gratis", "TV de pantalla plana", "Minibar", "Cafetera", "Aire acondicionado"],
    },
    {
      prefix: "Premium",
      priceRange: [199, 299],
      capacityRange: [2, 4],
      description: "Elegante habitación con dos camas dobles, perfecta para familias o pequeños grupos.",
      amenities: ["Wi-Fi gratis", "TV de pantalla plana", "Minibar", "Cafetera", "Aire acondicionado"],
    },
    {
      prefix: "Suite Junior",
      priceRange: [249, 349],
      capacityRange: [2, 3],
      description: "Suite con área de estar separada y vistas panorámicas de la ciudad.",
      amenities: ["Wi-Fi gratis", "TV de pantalla plana", "Minibar", "Cafetera", "Aire acondicionado", "Sala de estar"],
    },
    {
      prefix: "Suite Ejecutiva",
      priceRange: [299, 399],
      capacityRange: [2, 4],
      description: "Lujosa suite con sala de estar separada, cama king-size y comodidades premium.",
      amenities: [
        "Wi-Fi gratis",
        "TV de pantalla plana",
        "Minibar",
        "Cafetera",
        "Aire acondicionado",
        "Sala de estar separada",
      ],
    },
    {
      prefix: "Suite Familiar",
      priceRange: [349, 449],
      capacityRange: [4, 6],
      description:
        "Amplia suite diseñada para familias, con un dormitorio principal y un segundo dormitorio con camas gemelas.",
      amenities: [
        "Wi-Fi gratis",
        "TV de pantalla plana",
        "Minibar",
        "Cafetera",
        "Aire acondicionado",
        "Múltiples dormitorios",
      ],
    },
    {
      prefix: "Suite Presidencial",
      priceRange: [499, 699],
      capacityRange: [2, 4],
      description:
        "Nuestro alojamiento más lujoso, con una amplia sala de estar, comedor y dormitorio principal con cama king-size.",
      amenities: [
        "Wi-Fi gratis",
        "TV de pantalla plana",
        "Minibar",
        "Cafetera",
        "Aire acondicionado",
        "Sala de estar separada",
        "Comedor",
        "Balcón privado",
      ],
    },
  ]

  const bedTypes = ["King", "Queen", "Doble", "Twin", "Individual"]
  const views = ["Ciudad", "Jardín", "Piscina", "Interior", "Mar"]
  const floors = [1, 2, 3, 4, 5]

  const rooms: Room[] = []

  // Generar habitaciones organizadas por piso (10 habitaciones por piso)
  for (const floor of floors) {
    for (let roomNumber = 1; roomNumber <= 10; roomNumber++) {
      // Calcular el número de habitación basado en el piso (101, 102, ... 201, 202, etc.)
      const actualRoomNumber = floor * 100 + roomNumber

      const roomTypeIndex = Math.floor(Math.random() * roomTypes.length)
      const roomType = roomTypes[roomTypeIndex]

      const bedTypeIndex = Math.floor(Math.random() * bedTypes.length)
      const viewIndex = Math.floor(Math.random() * views.length)

      const price =
        Math.floor(Math.random() * (roomType.priceRange[1] - roomType.priceRange[0] + 1)) + roomType.priceRange[0]
      const capacity =
        Math.floor(Math.random() * (roomType.capacityRange[1] - roomType.capacityRange[0] + 1)) +
        roomType.capacityRange[0]

      // Generar un ID único basado en el número de habitación
      const id = `room-${actualRoomNumber}`

      // Generar nombre de habitación
      const name = `${roomType.prefix} ${bedTypes[bedTypeIndex]}`

      // Generar descripción completa
      const description = `${roomType.description} Disfrute de una cama ${bedTypes[bedTypeIndex].toLowerCase()} y hermosas vistas ${views[viewIndex].toLowerCase()}. Ubicada en el piso ${floor}.`

      // Generar imágenes
      const mainImage = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(name)}`
      const images = [
        mainImage,
        `/placeholder.svg?height=400&width=600&text=Vista+${views[viewIndex]}`,
        `/placeholder.svg?height=400&width=600&text=Baño`,
        `/placeholder.svg?height=400&width=600&text=Detalles`,
      ]

      // Determinar disponibilidad (70% disponibles, 30% no disponibles)
      const isAvailable = Math.random() > 0.3

      rooms.push({
        id,
        name,
        description,
        price,
        capacity,
        image: mainImage,
        images,
        amenities: roomType.amenities,
        isAvailable,
        floor,
        bedType: bedTypes[bedTypeIndex],
        view: views[viewIndex],
        roomNumber: actualRoomNumber,
      })
    }
  }

  // Ordenar habitaciones por piso y número
  return rooms.sort((a, b) => {
    if (a.floor !== b.floor) {
      return a.floor - b.floor
    }
    return a.roomNumber - b.roomNumber
  })
}

export const rooms: Room[] = generateRooms()
