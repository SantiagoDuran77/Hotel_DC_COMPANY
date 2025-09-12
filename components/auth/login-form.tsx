"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Shield, UserCheck, Building } from "lucide-react"
import * as authUtils from "@/lib/auth"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = authUtils.login(email, password)

      if (user) {
        const redirectPath = authUtils.getDashboardRoute(user)
        router.push(redirectPath)
      } else {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (email: string, role: string) => {
    setEmail(email)
    setPassword("123456")
  }

  const roleAccounts = [
    {
      role: "Administrador",
      email: "admin@hoteldc.com",
      icon: Shield,
      color: "text-red-600",
      description: "Acceso completo al sistema",
    },
    {
      role: "Recepción",
      email: "recepcion@hoteldc.com",
      icon: Building,
      color: "text-blue-600",
      description: "Gestión de reservas y check-in/out",
    },
    {
      role: "Empleado",
      email: "spa@hoteldc.com",
      icon: UserCheck,
      color: "text-green-600",
      description: "Servicios y tareas departamentales",
    },
    {
      role: "Cliente",
      email: "cliente1@ejemplo.com",
      icon: User,
      color: "text-purple-600",
      description: "Reservas y servicios personales",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">Hotel DC Company - Sistema de Gestión</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de Login */}
          <Card>
            <CardHeader>
              <CardTitle>Acceso al Sistema</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Accesos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>Selecciona un tipo de usuario para acceder rápidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleAccounts.map((account) => {
                  const IconComponent = account.icon
                  return (
                    <Button
                      key={account.email}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-transparent"
                      onClick={() => quickLogin(account.email, account.role)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 ${account.color}`} />
                        <div className="text-left">
                          <div className="font-medium">{account.role}</div>
                          <div className="text-sm text-gray-500">{account.email}</div>
                          <div className="text-xs text-gray-400">{account.description}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Contraseña universal:</strong> 123456
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
