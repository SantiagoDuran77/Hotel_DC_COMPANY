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

// Lista de países para el select
const paises = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", 
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", 
  "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", 
  "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", 
  "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", 
  "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", 
  "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", 
  "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", 
  "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", 
  "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría", "India", "Indonesia", 
  "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", 
  "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", 
  "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", 
  "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", 
  "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", 
  "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", 
  "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", 
  "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", 
  "República Centroafricana", "República Checa", "República del Congo", "República Democrática del Congo", 
  "República Dominicana", "República Sudafricana", "Ruanda", "Rumanía", "Rusia", "Samoa", 
  "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", 
  "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", 
  "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudán", "Sudán del Sur", "Suecia", 
  "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", 
  "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", 
  "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", 
  "Zambia", "Zimbabue"
].sort(); // Ordenar alfabéticamente

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
      setError("Por favor selecciona tu nacionalidad")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

              {/* Nacionalidad - Ahora es un select */}
              <div className="space-y-2">
                <Label htmlFor="nacionalidad">Nacionalidad</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <select
                    id="nacionalidad"
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Selecciona tu nacionalidad</option>
                    {paises.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </div>
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