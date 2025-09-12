import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ArrowLeft, Calendar, Phone, Dumbbell } from "lucide-react"

export default function GymServicePage() {
  const gymServices = [
    {
      name: "Acceso Completo",
      duration: "24/7",
      price: "Incluido",
      description: "Acceso ilimitado a todas las instalaciones del gimnasio durante su estancia",
      features: ["Equipos de última generación", "Área de cardio", "Zona de pesas", "Vestuarios premium"],
    },
    {
      name: "Entrenador Personal",
      duration: "60 min",
      price: "€50",
      description: "Sesión personalizada con entrenador certificado para optimizar su rutina",
      features: ["Plan personalizado", "Seguimiento de progreso", "Técnica correcta", "Motivación profesional"],
    },
    {
      name: "Clases Grupales",
      duration: "45 min",
      price: "€15",
      description: "Variedad de clases dirigidas: yoga, pilates, spinning y aeróbicos",
      features: ["Instructores certificados", "Diferentes niveles", "Horarios flexibles", "Ambiente motivador"],
    },
    {
      name: "Evaluación Física",
      duration: "30 min",
      price: "€30",
      description: "Análisis completo de composición corporal y plan de entrenamiento",
      features: ["Medición corporal", "Análisis de grasa", "Plan de objetivos", "Recomendaciones nutricionales"],
    },
  ]

  const equipment = [
    "Máquinas de cardio Technogym",
    "Zona completa de pesas libres",
    "Máquinas de musculación",
    "Área funcional con TRX",
    "Zona de stretching",
    "Equipos de rehabilitación",
  ]

  const classes = [
    { name: "Yoga Matutino", time: "7:00", duration: "60 min" },
    { name: "Spinning", time: "8:00", duration: "45 min" },
    { name: "Pilates", time: "18:00", duration: "50 min" },
    { name: "Aqua Aeróbicos", time: "19:00", duration: "45 min" },
    { name: "Yoga Nocturno", time: "20:00", duration: "60 min" },
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
                <h1 className="text-3xl font-bold text-gray-900">Gimnasio Completo</h1>
                <p className="text-gray-600">Mantenga su rutina de ejercicios con equipos de última generación</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Reservar Clase
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
            <Image src="/modern-gym-with-exercise-equipment-and-large-windo.png" alt="Gimnasio DC Company" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Fitness de Clase Mundial</h2>
                <p className="text-xl max-w-2xl">Equipos Technogym de última generación disponibles 24/7</p>
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
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Sobre Nuestro Gimnasio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Nuestro gimnasio de 400m² cuenta con los equipos más modernos de Technogym, la marca líder mundial en
                  equipos de fitness. Diseñado para satisfacer las necesidades de todos los niveles, desde principiantes
                  hasta atletas profesionales.
                </p>
                <p className="text-gray-600">
                  Ofrecemos un ambiente motivador con vistas panorámicas de la ciudad, aire acondicionado de última
                  generación, sistema de sonido premium y personal altamente cualificado disponible para asistirle en
                  todo momento.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Abierto 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Capacidad: 50 personas</span>
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
                <CardTitle>Equipamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {equipment.map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Servicios */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gymServices.map((service, index) => (
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
                    <Badge
                      variant={service.price === "Incluido" ? "default" : "secondary"}
                      className="text-lg font-bold"
                    >
                      {service.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Incluye:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full mt-4">
                    {service.price === "Incluido" ? "Acceder Ahora" : `Reservar ${service.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clases y Horarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Clases Dirigidas Hoy</CardTitle>
              <CardDescription>Únase a nuestras clases grupales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{classItem.name}</span>
                      <p className="text-sm text-gray-600">{classItem.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">{classItem.time}</span>
                      <Button size="sm" className="ml-3">
                        Reservar
                      </Button>
                    </div>
                  </div>
                ))}
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
                  <span className="font-medium">Recepción Gimnasio:</span>
                  <p className="text-primary">+34 91 123 4570</p>
                </div>
                <div>
                  <span className="font-medium">Entrenadores:</span>
                  <p className="text-primary">+34 91 123 4571</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-primary">gym@hoteldc.com</p>
                </div>
                <div>
                  <span className="font-medium">Ubicación:</span>
                  <p>Planta 2 - Ala Norte del Hotel</p>
                </div>
                <div>
                  <span className="font-medium">Acceso:</span>
                  <p>Tarjeta de habitación requerida</p>
                </div>
                <div className="pt-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Contactar Gimnasio
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
