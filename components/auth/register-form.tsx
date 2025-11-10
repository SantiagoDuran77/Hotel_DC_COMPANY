// app/auth/register/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, ExternalLink } from "lucide-react"
import { authUtils } from "@/lib/utils/authUtils"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
    direccion: "",
    nacionalidad: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError("Por favor ingresa tu nombre y apellido")
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Por favor ingresa tu correo electrónico")
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    if (!formData.phone.trim()) {
      setError("Por favor ingresa tu número de teléfono")
      setIsLoading(false)
      return
    }

    if (!formData.nacionalidad.trim()) {
      setError("Por favor ingresa tu nacionalidad")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los términos de servicio")
      setIsLoading(false)
      return
    }

    if (!acceptedPrivacy) {
      setError("Debes aceptar la política de privacidad")
      setIsLoading(false)
      return
    }

    try {
      // Registro real con backend - incluyendo todos los campos
      await authUtils.register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.phone,
        direccion: formData.direccion,
        nacionalidad: formData.nacionalidad
      })

      // Redirigir a login después de registro exitoso
      router.push("/auth/login?message=registered")
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Modal de Términos y Condiciones
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Términos y Condiciones</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowTermsModal(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">1. Aceptación de los Términos</h3>
              <p>Al registrarte en Hotel DC Company, aceptas cumplir con estos términos de servicio y todas las leyes y regulaciones aplicables.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Cuenta de Usuario</h3>
              <p>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Reservas y Pagos</h3>
              <p>Las reservas están sujetas a disponibilidad. Los precios pueden cambiar sin previo aviso. Aceptamos varios métodos de pago seguros.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Política de Cancelación</h3>
              <p>Puedes cancelar tu reserva hasta 48 horas antes del check-in sin cargo. Las cancelaciones posteriores pueden incurrir en cargos.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Conducta del Usuario</h3>
              <p>Debes comportarte de manera respetuosa y cumplir con todas las normas del hotel. Nos reservamos el derecho de negar el servicio.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowTermsModal(false)}>
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal de Política de Privacidad
  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Política de Privacidad</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">1. Información que Recopilamos</h3>
              <p>Recopilamos información personal como nombre, email, teléfono, dirección e información de pago para procesar tus reservas.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Uso de la Información</h3>
              <p>Utilizamos tu información para procesar reservas, mejorar nuestros servicios, comunicarnos contigo y cumplir con obligaciones legales.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Protección de Datos</h3>
              <p>Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado o divulgación.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Compartir Información</h3>
              <p>No vendemos tu información personal. Podemos compartirla con proveedores de servicios esenciales para tu reserva.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Tus Derechos</h3>
              <p>Tienes derecho a acceder, corregir o eliminar tu información personal. Contáctanos para ejercer estos derechos.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowPrivacyModal(false)}>
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-600">
              Regístrate para acceder a nuestros servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1-555-0123"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección (Opcional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Tu dirección completa"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Nacionalidad */}
              <div className="space-y-2">
                <Label htmlFor="nacionalidad">Nacionalidad</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nacionalidad"
                    name="nacionalidad"
                    type="text"
                    placeholder="Ej: Colombiana"
                    value={formData.nacionalidad}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Términos y Condiciones - Con botones simples */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 font-normal text-sm"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Términos y Condiciones
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptedPrivacy}
                    onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto la{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 font-normal text-sm"
                        onClick={() => setShowPrivacyModal(true)}
                      >
                        Política de Privacidad
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Botón de registro */}
              <Button 
                type="submit" 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm text-gray-600 w-full">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Modales */}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
    </>
  )
}