import type { Metadata } from "next"
import { Calendar, Users, Wifi, Coffee, Tv, Bath, Check } from "lucide-react"
import { getRoomById } from "@/lib/api"
import BookingForm from "@/components/booking-form"
import ImageCarousel from "@/components/image-carousel"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const room = await getRoomById(params.id)
  return {
    title: `${room.name} - HOTEL DC COMPANY`,
    description: room.description,
  }
}

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id)

  // Generar múltiples imágenes para el carrusel (en una aplicación real, estas vendrían de la base de datos)
  const roomImages = [
    room.image || "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800&text=Vista+1",
    "/placeholder.svg?height=600&width=800&text=Vista+2",
    "/placeholder.svg?height=600&width=800&text=Baño",
    "/placeholder.svg?height=600&width=800&text=Detalles",
  ]

  // Características adicionales de la habitación
  const features = [
    { name: "Wi-Fi gratis", icon: Wifi },
    { name: "Cafetera premium", icon: Coffee },
    { name: 'Smart TV 55"', icon: Tv },
    { name: "Baño de lujo", icon: Bath },
    { name: "Aire acondicionado", icon: Check },
    { name: "Caja fuerte", icon: Check },
    { name: "Minibar surtido", icon: Check },
    { name: "Servicio a la habitación 24h", icon: Check },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.name}</h1>

            <div className="mb-6">
              <ImageCarousel
                images={roomImages}
                alt={room.name}
                aspectRatio="video"
                className="rounded-lg overflow-hidden"
                showThumbnails={true}
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>Hasta {room.capacity} huéspedes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Disponible todo el año</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-gray-600 mb-6">{room.description}</p>

              <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className="h-5 w-5 text-primary mr-2" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Políticas de la Habitación</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Horarios</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-medium">15:00 - 23:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-medium">Hasta las 12:00</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Cancelación</h3>
                  <p className="text-gray-600">
                    Cancelación gratuita hasta 48 horas antes de la llegada. Después, se cobrará la primera noche.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Información Adicional</h3>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>No se permiten mascotas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>Habitación para no fumadores</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>Se aceptan tarjetas de crédito</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">${room.price}</span>
                <span className="text-gray-600">por noche</span>
              </div>

              <BookingForm roomId={room.id} price={room.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
