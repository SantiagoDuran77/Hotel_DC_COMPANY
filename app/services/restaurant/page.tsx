import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ArrowLeft, Calendar, Phone, ChefHat } from "lucide-react"

export default function RestaurantServicePage() {
  const menuCategories = [
    {
      name: "Desayuno Continental",
      time: "7:00 - 11:00",
      price: "€25",
      description: "Buffet completo con productos frescos, panadería artesanal y opciones internacionales",
      highlights: ["Panadería propia", "Productos orgánicos", "Opciones veganas"],
    },
    {
      name: "Almuerzo Ejecutivo",
      time: "12:00 - 16:00",
      price: "€35",
      description: "Menú de 3 platos con ingredientes de temporada y maridaje de vinos",
      highlights: ["Chef internacional", "Ingredientes locales", "Maridaje incluido"],
    },
    {
      name: "Cena Gourmet",
      time: "19:00 - 23:00",
      price: "€65",
      description: "Experiencia culinaria de alta cocina con menú degustación de 5 platos",
      highlights: ["Menú degustación", "Vinos premium", "Servicio personalizado"],
    },
    {
      name: "Servicio a la Habitación",
      time: "24 horas",
      price: "Variable",
      description: "Carta completa disponible las 24 horas con entrega en su habitación",
      highlights: ["Disponible 24/7", "Menú completo", "Entrega rápida"],
    },
  ]

  const specialties = [
    "Cocina mediterránea contemporánea",
    "Mariscos frescos diarios",
    "Carnes premium a la parrilla",
    "Postres artesanales",
    "Carta de vinos internacional",
    "Opciones vegetarianas y veganas",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/services">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Servicios
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Restaurante Gourmet</h1>
                <p className="text-gray-600">Experiencia culinaria excepcional con chef internacional</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Reservar Mesa
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image src="/elegant-restaurant-interior-with-fine-dining-setup.png" alt="Restaurante DC Company" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Gastronomía de Clase Mundial</h2>
                <p className="text-xl max-w-2xl">Descubra sabores únicos con nuestro chef de renombre internacional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Sobre Nuestro Restaurante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Nuestro restaurante gourmet ofrece una experiencia culinaria excepcional bajo la dirección de nuestro
                  chef ejecutivo, reconocido internacionalmente. Con capacidad para 80 comensales, el ambiente elegante
                  y sofisticado es perfecto para cenas románticas, reuniones de negocios o celebraciones especiales.
                </p>
                <p className="text-gray-600">
                  Utilizamos únicamente ingredientes frescos de la más alta calidad, muchos de ellos de productores
                  locales, para crear platos que combinan técnicas culinarias tradicionales con innovación
                  contemporánea.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Servicio 7:00 - 23:00</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Capacidad: 80 personas</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>Calificación: 4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {specialties.map((specialty, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Servicios de Comida */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {category.time}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {category.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Destacados:</h4>
                    <ul className="space-y-1">
                      {category.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full mt-4">
                    {category.name === "Servicio a la Habitación" ? "Ver Menú" : "Reservar Mesa"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Horarios y Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Desayuno</span>
                  <span>7:00 - 11:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Almuerzo</span>
                  <span>12:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cena</span>
                  <span>19:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Room Service</span>
                  <span>24 horas</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">* Reservas recomendadas para cena. Dress code: Smart casual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Reservas:</span>
                  <p className="text-primary">+34 91 123 4568</p>
                </div>
                <div>
                  <span className="font-medium">Room Service:</span>
                  <p className="text-primary">+34 91 123 4569</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-primary">restaurant@hoteldc.com</p>
                </div>
                <div>
                  <span className="font-medium">Ubicación:</span>
                  <p>Planta Baja - Lobby Principal</p>
                </div>
                <div className="pt-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Hacer Reserva
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
