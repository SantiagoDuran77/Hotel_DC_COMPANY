// components/auth/login-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Building, UserCheck, User, Mail } from "lucide-react"
import { authUtils } from "@/lib/utils/authUtils"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log('🎯 Starting login process...')
      const user = await authUtils.login(email, password)

      console.log('👤 User returned from login:', user)
      
      if (user) {
        // Pequeña pausa para asegurar que localStorage esté actualizado
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const redirectPath = authUtils.getDashboardRoute(user)
        console.log('🔄 Redirecting to:', redirectPath)
        
        // Forzar la redirección completa
        window.location.href = redirectPath
      } else {
        console.log('❌ No user returned')
        setError("Credenciales incorrectas. Verifica tu email y contraseña.")
      }
    } catch (err: any) {
      console.error('💥 Login error:', err)
      setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetMessage("")
    setError("")

    if (!resetEmail) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el correo de recuperación')
      }

      setResetMessage(data.message)
      setResetEmail("")
      
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo de recuperación. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (email: string, role: string) => {
    console.log('⚡ Quick login:', email, role)
    setEmail(email)
    // Para usuarios existentes, usar solo primeros 4 caracteres
    if (email.includes('hoteldc.com')) {
      setPassword("7777") // Para empleados
    } else {
      setPassword("1234") // Para clientes
    }
  }

  const roleAccounts = [
    {
      role: "Administrador",
      email: "carlos.ramirez@hoteldc.com",
      icon: Shield,
      color: "text-red-600",
      description: "Acceso completo al sistema",
      expectedRoute: "/admin"
    },
    {
      role: "Recepción", 
      email: "laura.martinez@hoteldc.com",
      icon: Building,
      color: "text-blue-600",
      description: "Gestión de reservas y check-in/out",
      expectedRoute: "/admin"
    },
    {
      role: "Limpieza",
      email: "sofia.moreno@hoteldc.com",
      icon: UserCheck,
      color: "text-green-600",
      description: "Servicios y mantenimiento",
      expectedRoute: "/admin"
    },
    {
      role: "Cliente Ejemplo",
      email: "juanperez@mail.com",
      icon: User,
      color: "text-purple-600",
      description: "Cliente frecuente del hotel",
      expectedRoute: "/dashboard"
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
              <CardDescription>
                {showForgotPassword 
                  ? "Recupera tu contraseña" 
                  : "Ingresa tus credenciales para acceder"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showForgotPassword ? (
                // Formulario de Login Normal
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
                        placeholder="Primeros 4 caracteres de tu contraseña"
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
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>

                  {/* Enlace de olvidé contraseña ABAJO del botón */}
                  <div className="text-center pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 hover:text-blue-800 font-normal"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>

                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-gray-600">
                      ¿No tienes cuenta?{" "}
                      <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                // Formulario de Recuperación de Contraseña
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="text-center mb-4">
                    <Mail className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Recuperar Contraseña</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="resetEmail">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="resetEmail"
                        name="resetEmail"
                        type="email"
                        autoComplete="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {resetMessage && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        {resetMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setResetEmail("")
                        setResetMessage("")
                        setError("")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        "Enviar Enlace"
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      ¿Recordaste tu contraseña?{" "}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm font-normal"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Volver al login
                      </Button>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Accesos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>Selecciona un usuario existente para acceder rápidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleAccounts.map((account) => {
                  const IconComponent = account.icon
                  return (
                    <Button
                      key={account.email}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-transparent hover:bg-gray-50"
                      onClick={() => quickLogin(account.email, account.role)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <IconComponent className={`h-5 w-5 ${account.color}`} />
                        <div className="text-left flex-1">
                          <div className="font-medium text-gray-900">{account.role}</div>
                          <div className="text-sm text-gray-600">{account.email}</div>
                          <div className="text-xs text-gray-500 mt-1">{account.description}</div>
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            → Ir a {account.expectedRoute}
                          </div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Importante:</strong> Usa solo los <strong>primeros 4 caracteres</strong> de tu contraseña
                </p>
                <p className="text-xs text-yellow-600 text-center mt-1">
                  Ejemplo: Si tu contraseña es "123456", usa "1234"
                </p>
              </div>

              {/* Información de recuperación */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">¿Problemas para acceder?</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Si olvidaste tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en el formulario de login.
                    </p>
                  </div>
                </div>
              </div>

              {/* Debug info */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Debug:</strong> Revisa la consola para ver la estructura del usuario
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}