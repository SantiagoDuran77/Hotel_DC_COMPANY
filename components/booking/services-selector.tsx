"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils, Car, Waves, Dumbbell, Coffee, Wifi, Clock, Star, MapPin, Users, Phone } from "lucide-react"
import * as authUtils from "@/lib/auth"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  duration?: string
  employeeId?: string
  icon: React.ReactNode
  isPopular?: boolean
  location?: string
}

interface ServicePackage {
  id: string
  name: string
  description: string
  services: string[]
  originalPrice: number
  discountedPrice: number
  savings: number
  isPopular?: boolean
  duration: string
}

const services: Service[] = [
  {
    id: "spa-massage",
    name: "Masaje Relajante",
    description: "Masaje corporal completo con aceites esenciales aromáticos",
    price: 80,
    category: "spa",
    duration: "60 min",
    employeeId: "employee1",
    location: "Spa - Sala 1",
    icon: <Waves className="h-5 w-5" />,
    isPopular: true,
  },
  {
    id: "spa-therapy",
    name: "Masaje Terapéutico",
    description: "Masaje especializado para aliviar tensiones musculares",
    price: 100,
    category: "spa",
    duration: "75 min",
    employeeId: "employee1",
    location: "Spa - Sala 2",
    icon: <Waves className="h-5 w-5" />,
  },
  {
    id: "room-service-dinner",
    name: "Cena en Habitación",
    description: "Cena gourmet servida en la comodidad de su habitación",
    price: 45,
    category: "food",
    duration: "45 min",
    employeeId: "employee2",
    location: "Su habitación",
    icon: <Utensils className="h-5 w-5" />,
    isPopular: true,
  },
  {
    id: "room-service-breakfast",
    name: "Desayuno en Habitación",
    description: "Desayuno continental servido a la hora que prefiera",
    price: 25,
    category: "food",
    duration: "30 min",
    employeeId: "employee2",
    location: "Su habitación",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    id: "airport-transfer",
    name: "Traslado al Aeropuerto",
    description: "Servicio de transporte privado y cómodo al aeropuerto",
    price: 50,
    category: "transport",
    duration: "45 min",
    employeeId: "employee3",
    location: "Lobby del hotel",
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "city-tour",
    name: "Tour por la Ciudad",
    description: "Recorrido guiado por los principales atractivos de la ciudad",
    price: 75,
    category: "transport",
    duration: "3 horas",
    employeeId: "employee3",
    location: "Lobby del hotel",
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "housekeeping-extra",
    name: "Limpieza Extra",
    description: "Servicio adicional de limpieza y organización de habitación",
    price: 30,
    category: "housekeeping",
    duration: "45 min",
    employeeId: "employee4",
    location: "Su habitación",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "gym-access",
    name: "Acceso al Gimnasio",
    description: "Acceso completo al gimnasio con equipos modernos",
    price: 0,
    category: "fitness",
    duration: "Todo el día",
    location: "Gimnasio - Piso 2",
    icon: <Dumbbell className="h-5 w-5" />,
  },
  {
    id: "wifi-premium",
    name: "WiFi Premium",
    description: "Internet de alta velocidad durante toda su estancia",
    price: 10,
    category: "tech",
    duration: "24/7",
    location: "Toda la propiedad",
    icon: <Wifi className="h-5 w-5" />,
  },
]

const packages: ServicePackage[] = [
  {
    id: "wellness-package",
    name: "Paquete Bienestar Total",
    description: "Relájese completamente con nuestro paquete de spa y bienestar",
    services: ["spa-massage", "spa-therapy", "gym-access"],
    originalPrice: 180,
    discountedPrice: 150,
    savings: 30,
    duration: "Día completo",
    isPopular: true,
  },
  {
    id: "gourmet-package",
    name: "Paquete Gastronómico",
    description: "Disfrute de la mejor gastronomía sin salir del hotel",
    services: ["room-service-breakfast", "room-service-dinner", "wifi-premium"],
    originalPrice: 80,
    discountedPrice: 65,
    savings: 15,
    duration: "Durante su estancia",
  },
  {
    id: "explorer-package",
    name: "Paquete Explorador",
    description: "Descubra la ciudad con comodidad y estilo",
    services: ["airport-transfer", "city-tour", "wifi-premium"],
    originalPrice: 135,
    discountedPrice: 110,
    savings: 25,
    duration: "Día completo",
  },
  {
    id: "luxury-package",
    name: "Paquete de Lujo Completo",
    description: "La experiencia más completa y lujosa de nuestro hotel",
    services: ["spa-massage", "room-service-dinner", "airport-transfer", "housekeeping-extra", "wifi-premium"],
    originalPrice: 215,
    discountedPrice: 175,
    savings: 40,
    duration: "Durante su estancia",
    isPopular: true,
  },
]

interface ServicesSelectorProps {
  selectedServices: string[]
  selectedPackages: string[]
  onServiceChange: (serviceId: string, selected: boolean) => void
  onPackageChange: (packageId: string, selected: boolean) => void
}

export default function ServicesSelector({
  selectedServices,
  selectedPackages,
  onServiceChange,
  onPackageChange,
}: ServicesSelectorProps) {
  const [activeTab, setActiveTab] = useState("services")

  const getServicesByCategory = (category: string) => {
    return services.filter((service) => service.category === category)
  }

  const categories = [
    { id: "spa", name: "Spa & Bienestar", icon: <Waves className="h-4 w-4" /> },
    { id: "food", name: "Gastronomía", icon: <Utensils className="h-4 w-4" /> },
    { id: "transport", name: "Transporte & Tours", icon: <Car className="h-4 w-4" /> },
    { id: "housekeeping", name: "Servicios de Habitación", icon: <Users className="h-4 w-4" /> },
    { id: "fitness", name: "Fitness & Recreación", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "tech", name: "Tecnología", icon: <Wifi className="h-4 w-4" /> },
  ]

  const calculateTotal = () => {
    let total = 0

    selectedServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      if (service) total += service.price
    })

    selectedPackages.forEach((packageId) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) total += pkg.discountedPrice
    })

    return total
  }

  const calculateSavings = () => {
    let savings = 0
    selectedPackages.forEach((packageId) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) savings += pkg.savings
    })
    return savings
  }

  const getEmployeeInfo = (employeeId: string) => {
    return authUtils.getEmployeeById(employeeId)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Servicios Individuales</TabsTrigger>
          <TabsTrigger value="packages">Paquetes Especiales</TabsTrigger>
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
                  <div className="grid grid-cols-1 gap-6">
                    {categoryServices.map((service) => {
                      const employee = service.employeeId ? getEmployeeInfo(service.employeeId) : null

                      return (
                        <Card key={service.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              id={service.id}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={(checked) => onServiceChange(service.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {service.icon}
                                    <h3 className="font-semibold text-lg">{service.name}</h3>
                                    {service.isPopular && (
                                      <Badge variant="secondary" className="text-xs">
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mb-3">{service.description}</p>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span>{service.duration}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        <span>{service.location}</span>
                                      </div>
                                    </div>

                                    {employee && (
                                      <Card className="p-3 bg-blue-50 border-blue-200">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarImage
                                              src={employee.avatar || "/placeholder.svg"}
                                              alt={employee.name}
                                            />
                                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <p className="font-medium text-sm">{employee.name}</p>
                                            <p className="text-xs text-gray-600">{employee.position}</p>
                                            <div className="flex items-center space-x-1 mt-1">
                                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                              <span className="text-xs">{employee.rating}</span>
                                              <span className="text-xs text-gray-500 flex items-center">
                                                <Phone className="h-3 w-3 mr-1" />
                                                {employee.phone}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {employee.specialties && (
                                          <div className="mt-2">
                                            <p className="text-xs font-medium text-gray-700 mb-1">Especialidades:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {employee.specialties.slice(0, 2).map((specialty, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                  {specialty}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </Card>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right ml-4">
                                  <p className="text-2xl font-bold text-primary">
                                    {service.price === 0 ? "Gratis" : `$${service.price}`}
                                  </p>
                                  {service.price > 0 && <p className="text-sm text-gray-500">por servicio</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.isPopular ? "ring-2 ring-blue-500" : ""}`}>
                {pkg.isPopular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Más Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={pkg.id}
                        checked={selectedPackages.includes(pkg.id)}
                        onCheckedChange={(checked) => onPackageChange(pkg.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription className="mt-2">{pkg.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Servicios incluidos:</h4>
                      {pkg.services.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        const employee = service?.employeeId ? getEmployeeInfo(service.employeeId) : null

                        return service ? (
                          <div
                            key={serviceId}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center space-x-2">
                              {service.icon}
                              <span>{service.name}</span>
                            </div>
                            {employee && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                                  <AvatarFallback className="text-xs">{employee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{employee.name}</span>
                              </div>
                            )}
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500 line-through">${pkg.originalPrice}</p>
                          <p className="text-lg font-bold text-green-600">${pkg.discountedPrice}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-green-600">
                            Ahorra ${pkg.savings}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{pkg.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Resumen de selección */}
      {(selectedServices.length > 0 || selectedPackages.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Resumen de Servicios Seleccionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((serviceId) => {
                const service = services.find((s) => s.id === serviceId)
                const employee = service?.employeeId ? getEmployeeInfo(service.employeeId) : null

                return service ? (
                  <div key={serviceId} className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <span className="text-sm font-medium">{service.name}</span>
                      {employee && <p className="text-xs text-gray-500">Con {employee.name}</p>}
                    </div>
                    <span className="text-sm font-medium">{service.price === 0 ? "Gratis" : `$${service.price}`}</span>
                  </div>
                ) : null
              })}

              {selectedPackages.map((packageId) => {
                const pkg = packages.find((p) => p.id === packageId)
                return pkg ? (
                  <div key={packageId} className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm font-medium">{pkg.name}</span>
                    <span className="text-sm font-medium text-green-600">${pkg.discountedPrice}</span>
                  </div>
                ) : null
              })}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Servicios:</span>
                  <span className="font-bold text-lg">${calculateTotal()}</span>
                </div>
                {calculateSavings() > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">Ahorros totales:</span>
                    <span className="text-sm font-medium">${calculateSavings()}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
