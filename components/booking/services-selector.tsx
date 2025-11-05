"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils, Car, Waves, Dumbbell, Coffee, Wifi, Clock, Star, MapPin, Users } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  duration: string
  icon: string
  isPopular?: boolean
  cantidad?: number
}

interface ServicesSelectorProps {
  selectedServices: Service[]
  onServiceChange: (services: Service[]) => void
}

const iconComponents: { [key: string]: React.ReactNode } = {
  waves: <Waves className="h-5 w-5" />,
  utensils: <Utensils className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
  dumbbell: <Dumbbell className="h-5 w-5" />,
  coffee: <Coffee className="h-5 w-5" />,
  wifi: <Wifi className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
}

const categories = [
  { id: "spa", name: "Spa & Bienestar", icon: <Waves className="h-4 w-4" /> },
  { id: "food", name: "Gastronomía", icon: <Utensils className="h-4 w-4" /> },
  { id: "transport", name: "Transporte & Tours", icon: <Car className="h-4 w-4" /> },
  { id: "housekeeping", name: "Servicios de Habitación", icon: <Users className="h-4 w-4" /> },
  { id: "fitness", name: "Fitness & Recreación", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "tech", name: "Tecnología", icon: <Wifi className="h-4 w-4" /> },
]

export default function ServicesSelector({
  selectedServices,
  onServiceChange,
}: ServicesSelectorProps) {
  const [activeTab, setActiveTab] = useState("services")
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Fetching services from backend...')
        const response = await fetch('http://localhost:5000/api/services')
        const data = await response.json()
        
        if (response.ok) {
          console.log('✅ Services loaded:', data.services.length)
          setServices(data.services)
        } else {
          console.error('❌ Error fetching services:', data.error)
        }
      } catch (error) {
        console.error('❌ Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const getServicesByCategory = (category: string) => {
    return services.filter((service) => service.category === category)
  }

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      onServiceChange([...selectedServices, { ...service, cantidad: 1 }])
    } else {
      onServiceChange(selectedServices.filter(s => s.id !== service.id))
    }
  }

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId)
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => 
      total + (service.price * (service.cantidad || 1)), 0
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando servicios...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Servicios Individuales</TabsTrigger>
          <TabsTrigger value="packages" disabled>Paquetes (Próximamente)</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {categories.map((category) => {
            const categoryServices = getServicesByCategory(category.id)
            if (categoryServices.length === 0) return null

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {category.icon}
                    <span>{category.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {categoryServices.map((service) => (
                      <Card key={service.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            id={service.id}
                            checked={isServiceSelected(service.id)}
                            onCheckedChange={(checked) => 
                              handleServiceToggle(service, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {iconComponents[service.icon] || <Star className="h-5 w-5" />}
                                  <h3 className="font-semibold text-lg">{service.name}</h3>
                                  {service.isPopular && (
                                    <Badge variant="secondary" className="text-xs">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{service.description}</p>

                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{service.duration}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Hotel DC Company</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-primary">
                                  {service.price === 0 ? "Gratis" : `$${service.price.toLocaleString()}`}
                                </p>
                                {service.price > 0 && <p className="text-sm text-gray-500">por servicio</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Los paquetes estarán disponibles próximamente.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resumen de selección */}
      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Servicios Seleccionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <div>
                    <span className="text-sm font-medium">{service.name}</span>
                    <p className="text-xs text-gray-500">
                      {service.price === 0 ? 'Gratis' : `$${service.price.toLocaleString()} c/u`}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ${(service.price * (service.cantidad || 1)).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Servicios:</span>
                  <span className="font-bold text-lg">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}