import { Link } from "react-router-dom"

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">¿Listo para tu Próxima Aventura?</h2>
        <p className="text-xl text-blue-100 mb-8">
          Reserva ahora y disfruta de una experiencia única en Hotel DC Company
        </p>
        <Link
          to="/booking"
          className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Reservar Ahora
        </Link>
      </div>
    </section>
  )
}

export default CallToAction
