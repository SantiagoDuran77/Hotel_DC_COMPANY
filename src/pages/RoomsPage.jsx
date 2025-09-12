const RoomsPage = () => {
  const rooms = [
    {
      id: 1,
      name: "Suite Presidencial",
      price: 500,
      image: "/placeholder.svg?height=300&width=400&text=Suite+Presidencial",
      description: "La máxima expresión del lujo con vistas panorámicas",
      amenities: ["Vista al mar", "Jacuzzi privado", "Servicio de mayordomo", "Terraza privada"],
    },
    {
      id: 2,
      name: "Habitación Deluxe",
      price: 200,
      image: "/placeholder.svg?height=300&width=400&text=Habitación+Deluxe",
      description: "Elegancia y confort en cada detalle",
      amenities: ["Balcón", "Minibar", "Baño de mármol", "WiFi gratuito"],
    },
    {
      id: 3,
      name: "Habitación Estándar",
      price: 120,
      image: "/placeholder.svg?height=300&width=400&text=Habitación+Estándar",
      description: "Comodidad y calidad a un precio accesible",
      amenities: ["Aire acondicionado", "TV por cable", "Caja fuerte", "WiFi gratuito"],
    },
    {
      id: 4,
      name: "Suite Familiar",
      price: 350,
      image: "/placeholder.svg?height=300&width=400&text=Suite+Familiar",
      description: "Perfecta para familias, con espacio adicional",
      amenities: ["Sala de estar", "Cocina pequeña", "Dos baños", "Área de juegos"],
    },
  ]

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Nuestras Habitaciones</h1>
          <p className="mt-4 text-lg text-gray-600">
            Descubre el confort y la elegancia en cada una de nuestras habitaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">{room.name}</h3>
                  <span className="text-2xl font-bold text-primary-600">${room.price}/noche</span>
                </div>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Amenidades:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {room.amenities.map((amenity, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                  Reservar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoomsPage
