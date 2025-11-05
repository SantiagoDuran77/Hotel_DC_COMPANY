"use client"

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Utensils, Dumbbell, SpadeIcon as Spa, Wifi, Car, Coffee, Users, Martini } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getServices } from "@/lib/api"
import type { Service } from "@/lib/types"

// Iconos por categoría
const categoryIcons: { [key: string]: any } = {
  'Alimentación': Utensils,
  'Bienestar': Spa,
  'Transporte': Car,
  'Limpieza': Coffee,
  'Comunicaciones': Wifi,
  'Recreación': Dumbbell,
  'Otros': Users
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('🔄 Loading services...')
        const servicesData = await getServices()
        console.log('✅ Services loaded:', servicesData)
        setServices(servicesData)
      } catch (error) {
        console.error('❌ Error loading services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios Exclusivos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En HOTEL DC COMPANY nos esforzamos por ofrecer una experiencia completa y lujosa. Descubra nuestra amplia
            gama de servicios diseñados para hacer su estancia inolvidable.
          </p>
          <p className="text-lg text-primary font-semibold mt-2">
            {services.length} servicios disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = categoryIcons[service.category] || Users
            
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <IconComponent className="h-16 w-16 text-primary mx-auto mb-2" />
                    <span className="text-sm font-semibold text-primary bg-white px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <p className="text-lg font-bold text-green-600">${service.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" className="flex-1 mr-2">
                      Reservar
                    </Button>
                    <Button variant="outline" size="sm">
                      Info
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
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