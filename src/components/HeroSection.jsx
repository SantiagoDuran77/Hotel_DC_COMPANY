import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <div className="relative bg-gray-900 h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Bienvenido a Hotel DC Company</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Experimenta el lujo y la comodidad en nuestro hotel de clase mundial. Tu estancia perfecta te espera.
        </p>
        <div className="space-x-4">
          <Link
            to="/booking"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Reservar Ahora
          </Link>
          <Link
            to="/rooms"
            className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
          >
            Ver Habitaciones
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
