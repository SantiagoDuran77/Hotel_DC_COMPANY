import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Utensils, Dumbbell, SpadeIcon as Spa, Wifi, Car, Coffee, Users, Martini } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Servicios - HOTEL DC COMPANY",
  description: "Descubra nuestra amplia gama de servicios exclusivos diseñados para hacer su estancia inolvidable.",
}

const services = [
  {
    icon: Utensils,
    title: "Restaurante Gourmet",
    description:
      "Disfrute de una experiencia culinaria excepcional con nuestro chef de renombre internacional y una selección de platos locales e internacionales.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Dumbbell,
    title: "Gimnasio Completo",
    description:
      "Mantenga su rutina de ejercicios con nuestro gimnasio de última generación, abierto las 24 horas para su conveniencia.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Spa,
    title: "Spa & Bienestar",
    description:
      "Relájese y rejuvenezca con nuestros tratamientos de spa personalizados, sauna, jacuzzi y piscina climatizada.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Wifi,
    title: "Wi-Fi de Alta Velocidad",
    description:
      "Conexión gratuita de alta velocidad en todas las áreas del hotel para mantenerse conectado durante su estancia.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Car,
    title: "Servicio de Transporte",
    description: "Ofrecemos servicio de transporte al aeropuerto y a los principales puntos de interés de la ciudad.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Coffee,
    title: "Desayuno Premium",
    description: "Comience su día con nuestro desayuno buffet premium, que incluye opciones locales e internacionales.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Users,
    title: "Salas de Conferencias",
    description: "Espacios versátiles para reuniones y eventos, equipados con la última tecnología audiovisual.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Martini,
    title: "Bar & Lounge",
    description: "Relájese en nuestro elegante bar con una amplia selección de cócteles, vinos y licores premium.",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios Exclusivos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En HOTEL DC COMPANY nos esforzamos por ofrecer una experiencia completa y lujosa. Descubra nuestra amplia
            gama de servicios diseñados para hacer su estancia inolvidable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-48">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button variant="outline" className="w-full">
                  Más Información
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary text-white rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Paquetes Especiales</h2>
              <p className="mb-6">
                Descubra nuestros paquetes especiales que combinan alojamiento de lujo con experiencias exclusivas.
                Desde escapadas románticas hasta aventuras familiares, tenemos el paquete perfecto para cada ocasión.
              </p>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="/booking">Ver Paquetes</Link>
              </Button>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Paquetes especiales"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Servicios Personalizados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ¿Necesita algo especial para su estancia? Nuestro equipo de concierge está disponible las 24 horas para
            atender sus solicitudes personalizadas.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contactar Concierge</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
