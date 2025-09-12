const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hotel DC Company</h3>
            <p className="text-gray-300">Tu destino de lujo y confort. Experiencias inolvidables te esperan.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/rooms" className="text-gray-300 hover:text-white">
                  Habitaciones
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-white">
                  Servicios
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📍 Calle Principal 123</li>
              <li>📞 +34 91 123 4567</li>
              <li>✉️ info@hoteldc.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">© 2024 Hotel DC Company. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
