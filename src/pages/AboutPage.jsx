const AboutPage = () => {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Sobre Nosotros</h1>
          <p className="mt-4 text-lg text-gray-600">Conoce la historia y los valores que nos definen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <p className="text-gray-600 mb-4">
              Hotel DC Company nació en 1985 con la visión de crear un refugio de lujo y confort para viajeros de todo
              el mundo. Durante más de tres décadas, hemos sido pioneros en la industria hotelera, estableciendo nuevos
              estándares de excelencia.
            </p>
            <p className="text-gray-600 mb-4">
              Nuestro compromiso con la calidad y la atención personalizada nos ha convertido en el destino preferido
              para huéspedes que buscan experiencias únicas e inolvidables.
            </p>
            <p className="text-gray-600">
              Cada detalle de nuestro hotel ha sido cuidadosamente diseñado para ofrecer el máximo confort y elegancia,
              desde nuestras habitaciones hasta nuestros servicios.
            </p>
          </div>
          <div>
            <img
              src="/placeholder.svg?height=400&width=600&text=Hotel+Historia"
              alt="Historia del hotel"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excelencia</h3>
            <p className="text-gray-600">Comprometidos con los más altos estándares de calidad en cada servicio.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hospitalidad</h3>
            <p className="text-gray-600">Tratamos a cada huésped como parte de nuestra familia extendida.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovación</h3>
            <p className="text-gray-600">Constantemente evolucionamos para ofrecer experiencias únicas.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nuestro Equipo</h2>
          <p className="text-gray-600 text-center mb-8">
            Contamos con un equipo de profesionales apasionados por brindar el mejor servicio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "María González",
                role: "Gerente General",
                image: "/placeholder.svg?height=200&width=200&text=María",
              },
              {
                name: "Carlos Rodríguez",
                role: "Chef Ejecutivo",
                image: "/placeholder.svg?height=200&width=200&text=Carlos",
              },
              {
                name: "Ana Martínez",
                role: "Directora de Spa",
                image: "/placeholder.svg?height=200&width=200&text=Ana",
              },
              {
                name: "Luis Fernández",
                role: "Concierge Principal",
                image: "/placeholder.svg?height=200&width=200&text=Luis",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
