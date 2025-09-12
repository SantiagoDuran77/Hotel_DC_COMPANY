const ServicesPage = () => {
  const services = [
    {
      id: 1,
      name: "Spa & Wellness",
      icon: "🧘‍♀️",
      description: "Relájate y rejuvenece en nuestro spa de clase mundial con tratamientos exclusivos.",
      features: ["Masajes terapéuticos", "Tratamientos faciales", "Sauna y vapor", "Yoga y meditación"],
    },
    {
      id: 2,
      name: "Restaurante Gourmet",
      icon: "🍽️",
      description: "Disfruta de una experiencia culinaria única con nuestra cocina internacional.",
      features: ["Chef ejecutivo", "Menú degustación", "Vinos selectos", "Servicio personalizado"],
    },
    {
      id: 3,
      name: "Gimnasio",
      icon: "💪",
      description: "Mantente en forma con nuestro gimnasio completamente equipado.",
      features: ["Equipos modernos", "Entrenador personal", "Clases grupales", "Horario 24/7"],
    },
    {
      id: 4,
      name: "Servicio a la Habitación",
      icon: "🛎️",
      description: "Servicio de primera clase disponible las 24 horas del día.",
      features: ["Menú completo", "Servicio rápido", "Disponible 24/7", "Presentación elegante"],
    },
    {
      id: 5,
      name: "Centro de Negocios",
      icon: "💼",
      description: "Instalaciones completas para tus necesidades empresariales.",
      features: [
        "Salas de reuniones",
        "Equipos audiovisuales",
        "Internet de alta velocidad",
        "Servicios de secretaría",
      ],
    },
    {
      id: 6,
      name: "Concierge",
      icon: "🎩",
      description: "Nuestro equipo de concierge está aquí para hacer tu estancia perfecta.",
      features: ["Reservas de restaurantes", "Tours y excursiones", "Transporte", "Recomendaciones locales"],
    },
  ]

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Nuestros Servicios</h1>
          <p className="mt-4 text-lg text-gray-600">Servicios premium diseñados para superar tus expectativas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                <ul className="space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="text-primary-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
