import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ArrowLeft, Calendar, Phone } from "lucide-react"

export default function SpaServicePage() {
  const spaServices = [
    {
      name: "Masaje Relajante",
      duration: "60 min",
      price: "€80",
      description: "Masaje corporal completo con aceites esenciales para relajación profunda",
      benefits: ["Reduce el estrés", "Mejora la circulación", "Alivia tensiones musculares"],
    },
    {
      name: "Tratamiento Facial Premium",
      duration: "90 min",
      price: "€120",
      description: "Limpieza profunda, exfoliación y hidratación con productos de lujo",
      benefits: ["Rejuvenece la piel", "Hidratación profunda", "Efecto anti-edad"],
    },
    {
      name: "Aromaterapia",
      duration: "45 min",
      price: "€65",
      description: "Sesión de relajación con aceites aromáticos y música terapéutica",
      benefits: ["Equilibra las emociones", "Mejora el sueño", "Reduce la ansiedad"],
    },
    {
      name: "Paquete Parejas",
      duration: "120 min",
      price: "€200",
      description: "Experiencia romántica con masajes simultáneos y champán",
      benefits: ["Experiencia compartida", "Ambiente romántico", "Incluye refreshments"],
    },
  ]

  const facilities = [
    "Sauna finlandesa",
    "Baño turco",
    "Piscina de hidroterapia",
    "Sala de relajación",
    "Vestuarios premium",
    "Área de descanso",
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
                <h1 className="text-3xl font-bold text-gray-900">Spa & Bienestar</h1>
                <p className="text-gray-600">Relájese y rejuvenezca en nuestro spa de lujo</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Reservar Cita
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
            <Image src="/luxury-spa-interior-with-massage-tables-and-candle.png" alt="Spa DC Company" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Experiencia de Bienestar Completa</h2>
                <p className="text-xl max-w-2xl">
                  Descubra la tranquilidad en nuestro spa de clase mundial con tratamientos personalizados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sobre Nuestro Spa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Nuestro spa ofrece un refugio de paz y tranquilidad en el corazón del hotel. Con más de 500m²
                  dedicados al bienestar, contamos con instalaciones de última generación y un equipo de terapeutas
                  altamente cualificados.
                </p>
                <p className="text-gray-600">
                  Utilizamos únicamente productos premium y técnicas tradicionales combinadas con las últimas
                  innovaciones en tratamientos de spa para garantizar una experiencia inolvidable.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Abierto 8:00 - 22:00</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Capacidad: 20 personas</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>Calificación: 4.9/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Instalaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {facilities.map((facility, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {facility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Servicios */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Tratamientos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {service.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Beneficios:</h4>
                    <ul className="space-y-1">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full mt-4">Reservar {service.name}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Horarios y Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Lunes - Viernes</span>
                  <span>8:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sábados</span>
                  <span>9:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Domingos</span>
                  <span>10:00 - 21:00</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">* Se recomienda reservar con 24 horas de anticipación</p>
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
                  <span className="font-medium">Teléfono Directo:</span>
                  <p className="text-primary">+34 91 123 4567</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-primary">spa@hoteldc.com</p>
                </div>
                <div>
                  <span className="font-medium">Ubicación:</span>
                  <p>Planta Baja - Ala Este del Hotel</p>
                </div>
                <div className="pt-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar Ahora
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
