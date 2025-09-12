const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      comment: "Una experiencia increíble. El servicio fue excepcional y las instalaciones de primera clase.",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      comment: "El mejor hotel en el que me he hospedado. Definitivamente regresaré.",
      rating: 5,
    },
    {
      id: 3,
      name: "Ana Martínez",
      comment: "Perfecto para una escapada romántica. Cada detalle fue cuidado al máximo.",
      rating: 5,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que Dicen Nuestros Huéspedes</h2>
          <p className="text-lg text-gray-600">Testimonios reales de huéspedes satisfechos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
              <p className="font-semibold text-gray-900">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
