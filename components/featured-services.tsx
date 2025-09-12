import Link from "next/link"
import { Utensils, SpadeIcon as Spa, Dumbbell, Wifi, Car, Coffee, ArrowRight } from "lucide-react"

// Servicios destacados para mostrar en la página principal
const services = [
  {
    icon: Utensils,
    title: "Restaurante Gourmet",
    description: "Disfrute de una experiencia culinaria excepcional con nuestro chef de renombre internacional.",
  },
  {
    icon: Spa,
    title: "Spa & Bienestar",
    description: "Relájese y rejuvenezca con nuestros tratamientos de spa personalizados y áreas de bienestar.",
  },
  {
    icon: Dumbbell,
    title: "Gimnasio Completo",
    description: "Mantenga su rutina de ejercicios con nuestro gimnasio de última generación, abierto 24/7.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi de Alta Velocidad",
    description: "Conexión gratuita de alta velocidad en todas las áreas del hotel para mantenerse conectado.",
  },
  {
    icon: Car,
    title: "Servicio de Transporte",
    description: "Ofrecemos servicio de transporte al aeropuerto y a los principales puntos de interés.",
  },
  {
    icon: Coffee,
    title: "Desayuno Premium",
    description: "Comience su día con nuestro desayuno buffet premium con opciones locales e internacionales.",
  },
]

export default function FeaturedServices() {
  // Mostrar solo los primeros 3 servicios en la página principal
  const featuredServices = services.slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredServices.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <Link href="/services" className="text-primary hover:underline flex items-center text-sm">
            Más información
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      ))}
    </div>
  )
}
