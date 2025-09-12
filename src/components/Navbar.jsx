"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Hotel DC Company
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Inicio
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary-600">
              Habitaciones
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary-600">
              Servicios
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600">
              Nosotros
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600">
              Contacto
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-primary-600">
              Reservar
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin"
                      : user.role === "reception"
                        ? "/reception"
                        : user.role === "employee"
                          ? "/employee"
                          : "/dashboard"
                  }
                  className="text-primary-600 hover:text-primary-700"
                >
                  Dashboard
                </Link>
                <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="text-gray-700 hover:text-primary-600">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
