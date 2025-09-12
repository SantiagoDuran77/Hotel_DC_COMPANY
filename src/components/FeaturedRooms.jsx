import { Link } from "react-router-dom"

const FeaturedRooms = () => {
  const rooms = [
    {
      id: 1,
      name: "Suite Presidencial",
      price: 500,
      image: "/placeholder.svg?height=300&width=400&text=Suite+Presidencial",
      description: "La máxima expresión del lujo con vistas panorámicas",
    },
    {
      id: 2,
      name: "Habitación Deluxe",
      price: 200,
      image: "/placeholder.svg?height=300&width=400&text=Habitación+Deluxe",
      description: "Elegancia y confort en cada detalle",
    },
    {
      id: 3,
      name: "Habitación Estándar",
      price: 120,
      image: "/placeholder.svg?height=300&width=400&text=Habitación+Estándar",
      description: "Comodidad y calidad a un precio accesible",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Habitaciones</h2>
          <p className="text-lg text-gray-600">Descubre nuestras habitaciones diseñadas para tu máximo confort</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">${room.price}/noche</span>
                  <Link to="/booking" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedRooms
