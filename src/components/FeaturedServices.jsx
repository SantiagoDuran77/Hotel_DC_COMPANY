const FeaturedServices = () => {
  const services = [
    {
      id: 1,
      name: "Spa & Wellness",
      icon: "🧘‍♀️",
      description: "Relájate en nuestro spa de clase mundial",
    },
    {
      id: 2,
      name: "Restaurante Gourmet",
      icon: "🍽️",
      description: "Deléitate con nuestra cocina internacional",
    },
    {
      id: 3,
      name: "Gimnasio",
      icon: "💪",
      description: "Mantente en forma en nuestro gimnasio moderno",
    },
    {
      id: 4,
      name: "Servicio a la Habitación",
      icon: "🛎️",
      description: "Servicio 24/7 para tu comodidad",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-gray-600">Servicios premium para hacer tu estancia inolvidable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="text-center">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedServices
