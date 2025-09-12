"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Shield, UserCheck, Users, Key, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccessGuide() {
  const router = useRouter()

  const userTypes = [
    {
      role: "Administrador",
      icon: Shield,
      email: "admin@hoteldc.com",
      password: "123456",
      dashboard: "/admin",
      description: "Acceso completo al sistema, gestión de usuarios, habitaciones, reportes",
      color: "bg-red-100 text-red-800",
      features: ["Gestión de usuarios", "Reportes financieros", "Configuración del sistema", "Supervisión general"],
    },
    {
      role: "Recepcionista",
      icon: UserCheck,
      email: "recepcion@hoteldc.com",
      password: "123456",
      dashboard: "/reception",
      description: "Gestión de reservas, check-in/check-out, atención al cliente",
      color: "bg-blue-100 text-blue-800",
      features: ["Check-in/Check-out", "Gestión de reservas", "Atención al cliente", "Facturación"],
    },
    {
      role: "Empleado",
      icon: User,
      email: "spa@hoteldc.com",
      password: "123456",
      dashboard: "/employee",
      description: "Gestión de servicios asignados, horarios, clientes",
      color: "bg-green-100 text-green-800",
      features: ["Servicios del día", "Horarios", "Clientes asignados", "Rendimiento personal"],
    },
    {
      role: "Cliente",
      icon: Users,
      email: "cliente1@ejemplo.com",
      password: "123456",
      dashboard: "/dashboard",
      description: "Reservas personales, historial, perfil, servicios",
      color: "bg-purple-100 text-purple-800",
      features: ["Mis reservas", "Historial", "Perfil personal", "Servicios adicionales"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hotel DC Company</h1>
          <p className="text-xl text-gray-600 mb-6">Sistema de Gestión Hotelera</p>
          <div className="bg-white rounded-lg p-4 shadow-md inline-block">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Key className="w-4 h-4" />
              <span>
                Contraseña universal para todas las cuentas: <strong>123456</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{userType.role}</CardTitle>
                        <Badge className={userType.color}>{userType.dashboard}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-2">{userType.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Credenciales de acceso:</div>
                    <div className="font-mono text-sm">
                      <div>
                        <strong>Email:</strong> {userType.email}
                      </div>
                      <div>
                        <strong>Contraseña:</strong> {userType.password}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Funcionalidades:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {userType.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" onClick={() => router.push("/auth/login")}>
                    Acceder como {userType.role}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Otros Empleados Disponibles</CardTitle>
            <CardDescription className="text-center">
              Diferentes departamentos con acceso al dashboard de empleados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Chef Principal", email: "cocina@hoteldc.com", dept: "Restaurante" },
                { name: "Supervisora Limpieza", email: "limpieza@hoteldc.com", dept: "Housekeeping" },
                { name: "Conductor", email: "transporte@hoteldc.com", dept: "Transporte" },
                { name: "Terapeuta Spa", email: "spa@hoteldc.com", dept: "Spa" },
              ].map((emp, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-medium text-gray-900">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.dept}</div>
                  <div className="text-xs font-mono text-gray-500 mt-1">{emp.email}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
