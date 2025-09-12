import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto - Hotel de Lujo",
  description: "Póngase en contacto con nosotros para cualquier consulta o reserva.",
}

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacto</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Estamos aquí para ayudarle con cualquier pregunta o solicitud que pueda tener. No dude en ponerse en
              contacto con nosotros utilizando cualquiera de los siguientes métodos:
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-primary mr-3" />
                <span>+34 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary mr-3" />
                <span>info@hoteldelujo.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-3 mt-1" />
                <span>Calle Principal 123, 28001 Madrid, España</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Envíenos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
