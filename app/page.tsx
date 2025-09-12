import Link from "next/link"
import Image from "next/image"
import { Users, MapPin, Star, Utensils } from "lucide-react"
import FeaturedRooms from "@/components/featured-rooms"
import HeroSection from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import FeaturedServices from "@/components/featured-services"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedRooms />
      <FeaturedServices />

      {/* Sección de experiencia de lujo */}
      <section className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-96 lg:h-auto">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Experiencia de lujo"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experiencia DC Company</h2>
            <p className="text-gray-600 mb-6">
              En HOTEL DC COMPANY, creemos que cada estancia debe ser extraordinaria. Nuestro compromiso con la
              excelencia se refleja en cada detalle, desde la decoración elegante hasta el servicio personalizado que
              ofrecemos a cada huésped.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Star className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Servicio 5 Estrellas</h4>
                  <p className="text-sm text-gray-500">Atención personalizada las 24 horas</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Ubicación Premium</h4>
                  <p className="text-sm text-gray-500">En el corazón de la ciudad</p>
                </div>
              </div>
              <div className="flex items-start">
                <Utensils className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Gastronomía Exclusiva</h4>
                  <p className="text-sm text-gray-500">Chef de renombre internacional</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Eventos Especiales</h4>
                  <p className="text-sm text-gray-500">Espacios versátiles para cada ocasión</p>
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href="/about">Conocer Más</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Por qué elegirnos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ubicación privilegiada</h3>
            <p className="text-gray-600">
              Situado en el corazón de la ciudad, con fácil acceso a atracciones, tiendas y restaurantes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Experiencia de lujo</h3>
            <p className="text-gray-600">
              Disfrute de comodidades premium y servicio personalizado para una estancia inolvidable.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personal dedicado</h3>
            <p className="text-gray-600">
              Nuestro equipo profesional está disponible las 24 horas para garantizar su comodidad y satisfacción.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de testimonios */}
      <section className="mt-16 bg-gray-100 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lo que dicen nuestros huéspedes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Una experiencia inolvidable. Las habitaciones son espaciosas y elegantes, el personal es extremadamente
              atento y la ubicación es perfecta."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">María García</p>
                <p className="text-sm text-gray-500">Madrid, España</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-600 mb-4 italic">
              "El restaurante del hotel ofrece una de las mejores experiencias gastronómicas que he tenido.
              Definitivamente volveré en mi próxima visita."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Carlos Rodríguez</p>
                <p className="text-sm text-gray-500">Barcelona, España</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex text-yellow-400 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Las instalaciones del spa son excepcionales. Me sentí completamente renovado después de mi tratamiento.
              El personal es profesional y muy amable."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Ana Martínez</p>
                <p className="text-sm text-gray-500">Valencia, España</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
