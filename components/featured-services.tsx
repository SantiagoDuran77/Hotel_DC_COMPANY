"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Utensils, SpadeIcon as Spa, Dumbbell, Wifi, Car, Coffee, ArrowRight } from "lucide-react"
import { getFeaturedServices } from "@/lib/api"
import type { Service } from "@/lib/types"

// Iconos por categoría
const categoryIcons: { [key: string]: any } = {
  'Alimentación': Utensils,
  'Bienestar': Spa,
  'Transporte': Car,
  'Limpieza': Coffee,
  'Comunicaciones': Wifi,
  'Recreación': Dumbbell,
  'Otros': Coffee
}

export default function FeaturedServices() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedServices = async () => {
      try {
        console.log('🔄 Loading featured services...')
        const services = await getFeaturedServices()
        console.log('✅ Featured services loaded:', services)
        setFeaturedServices(services)
      } catch (error) {
        console.error('❌ Error loading featured services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedServices()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredServices.map((service) => {
        const IconComponent = categoryIcons[service.category] || Coffee
        
        return (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">${service.price.toLocaleString()}</span>
              <Link href="/services" className="text-primary hover:underline flex items-center text-sm">
                Más información
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}