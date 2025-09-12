"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Plus, Minus, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import RoomSelector from "./room-selector"

// Datos simulados para servicios adicionales
const additionalServices = [
  { id: "breakfast", name: "Desayuno buffet", description: "Desayuno completo tipo buffet", price: 25 },
  { id: "parking", name: "Estacionamiento", description: "Estacionamiento privado", price: 20 },
  { id: "airport-transfer", name: "Traslado al aeropuerto", description: "Servicio de traslado privado", price: 60 },
  { id: "spa-access", name: "Acceso al spa", description: "Acceso completo a instalaciones de spa", price: 45 },
  { id: "late-checkout", name: "Late check-out", description: "Salida tardía hasta las 16:00", price: 40 },
  { id: "welcome-drink", name: "Bebida de bienvenida", description: "Cóctel de bienvenida a la llegada", price: 15 },
  {
    id: "room-decoration",
    name: "Decoración especial",
    description: "Decoración romántica o de celebración",
    price: 55,
  },
  {
    id: "fruit-basket",
    name: "Cesta de frutas",
    description: "Selección de frutas frescas en la habitación",
    price: 30,
  },
]

// Datos simulados para tipos de cama
const bedOptions = [
  { id: "king", name: "King Size", description: "1 cama king size (200x200cm)" },
  { id: "queen", name: "Queen Size", description: "1 cama queen size (180x200cm)" },
  { id: "twin", name: "Twin", description: "2 camas individuales (90x200cm)" },
  { id: "double-twin", name: "Doble Twin", description: "2 camas dobles (140x200cm)" },
]

// Datos simulados para tipos de almohadas
const pillowOptions = [
  { id: "soft", name: "Suave", description: "Almohadas suaves de pluma" },
  { id: "firm", name: "Firme", description: "Almohadas firmes de espuma viscoelástica" },
  { id: "hypoallergenic", name: "Hipoalergénica", description: "Almohadas hipoalergénicas" },
  { id: "cervical", name: "Cervical", description: "Almohadas especiales para soporte cervical" },
]

export default function AdvancedBookingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Fechas y huéspedes
    checkIn: new Date(),
    checkOut: addDays(new Date(), 3),
    adults: 2,
    children: 0,
    rooms: 1,

    // Paso 2: Selección de habitación
    selectedRoomId: "",
    selectedRoomName: "",
    selectedRoomPrice: 0,

    // Paso 3: Personalización
    bedType: "king",
    pillowType: "soft",
    floorPreference: "any",
    viewPreference: "any",
    specialOccasion: "",
    specialRequests: "",

    // Paso 4: Servicios adicionales
    additionalServices: [] as string[],

    // Paso 5: Información de contacto
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Paso 6: Pago
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    savePaymentInfo: false,
    agreeTerms: false,
  })

  // Calcular noches y precio total
  const nights = differenceInDays(formData.checkOut, formData.checkIn)
  const roomTotal = formData.selectedRoomPrice * nights * formData.rooms

  // Calcular el costo de servicios adicionales
  const servicesTotal = formData.additionalServices.reduce((total, serviceId) => {
    const service = additionalServices.find((s) => s.id === serviceId)
    return total + (service ? service.price : 0)
  }, 0)

  // Precio total
  const totalPrice = roomTotal + servicesTotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const services = [...prev.additionalServices]
      if (services.includes(serviceId)) {
        return { ...prev, additionalServices: services.filter((id) => id !== serviceId) }
      } else {
        return { ...prev, additionalServices: [...services, serviceId] }
      }
    })
  }

  const handleDateChange = (field: "checkIn" | "checkOut", date: Date | undefined) => {
    if (!date) return

    if (field === "checkIn") {
      // Si la fecha de salida es anterior a la nueva fecha de entrada, ajustarla
      const newCheckOut = formData.checkOut < date ? addDays(date, 1) : formData.checkOut
      setFormData((prev) => ({ ...prev, checkIn: date, checkOut: newCheckOut }))
    } else {
      setFormData((prev) => ({ ...prev, checkOut: date }))
    }
  }

  const handleGuestChange = (field: "adults" | "children" | "rooms", increment: boolean) => {
    setFormData((prev) => {
      const value = prev[field]
      let newValue

      if (increment) {
        newValue = field === "adults" ? Math.min(value + 1, 10) : Math.min(value + 1, 5)
      } else {
        newValue = field === "adults" ? Math.max(value - 1, 1) : Math.max(value - 1, 0)
      }

      return { ...prev, [field]: newValue }
    })
  }

  const handleRoomSelection = (roomId: string, roomName: string, roomPrice: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoomId: roomId,
      selectedRoomName: roomName,
      selectedRoomPrice: roomPrice,
    }))
  }

  const nextStep = () => {
    // Validación básica por paso
    if (currentStep === 1) {
      if (!formData.checkIn || !formData.checkOut) {
        alert("Por favor, seleccione las fechas de entrada y salida.")
        return
      }
    } else if (currentStep === 2) {
      if (!formData.selectedRoomId) {
        alert("Por favor, seleccione una habitación.")
        return
      }
    } else if (currentStep === 5) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Por favor, complete todos los campos de contacto.")
        return
      }
    } else if (currentStep === 6) {
      if (
        formData.paymentMethod === "credit-card" &&
        (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvc)
      ) {
        alert("Por favor, complete todos los campos de pago.")
        return
      }

      if (!formData.agreeTerms) {
        alert("Debe aceptar los términos y condiciones para continuar.")
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // En una aplicación real, aquí enviaríamos los datos a la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirigir a la página de confirmación
      router.push("/booking/confirmation?id=RES" + Math.floor(100000 + Math.random() * 900000))
    } catch (error) {
      console.error("Error al procesar la reserva:", error)
      alert("Ha ocurrido un error al procesar su reserva. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Fechas y Huéspedes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="check-in">Fecha de Llegada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1" id="check-in">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.checkIn ? (
                        format(formData.checkIn, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.checkIn}
                      onSelect={(date) => handleDateChange("checkIn", date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="check-out">Fecha de Salida</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                      id="check-out"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.checkOut ? (
                        format(formData.checkOut, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.checkOut}
                      onSelect={(date) => handleDateChange("checkOut", date)}
                      initialFocus
                      disabled={(date) => date <= formData.checkIn || date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Adultos</Label>
                <div className="flex items-center mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("adults", false)}
                    disabled={formData.adults <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 text-center w-8">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("adults", true)}
                    disabled={formData.adults >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Niños</Label>
                <div className="flex items-center mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("children", false)}
                    disabled={formData.children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 text-center w-8">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("children", true)}
                    disabled={formData.children >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Habitaciones</Label>
                <div className="flex items-center mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("rooms", false)}
                    disabled={formData.rooms <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 text-center w-8">{formData.rooms}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange("rooms", true)}
                    disabled={formData.rooms >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Información de su estancia</h3>
              <p className="text-sm text-blue-700">
                {nights} {nights === 1 ? "noche" : "noches"}, {formData.adults}{" "}
                {formData.adults === 1 ? "adulto" : "adultos"}
                {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? "niño" : "niños"}`},
                {formData.rooms} {formData.rooms === 1 ? "habitación" : "habitaciones"}
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Selección de Habitación</h2>
            <RoomSelector
              checkIn={formData.checkIn}
              checkOut={formData.checkOut}
              adults={formData.adults}
              children={formData.children}
              onSelectRoom={handleRoomSelection}
              selectedRoomId={formData.selectedRoomId}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personalización de la Habitación</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bedType">Tipo de Cama</Label>
                <select
                  id="bedType"
                  name="bedType"
                  value={formData.bedType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  {bedOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="pillowType">Tipo de Almohada</Label>
                <select
                  id="pillowType"
                  name="pillowType"
                  value={formData.pillowType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  {pillowOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="floorPreference">Preferencia de Planta</Label>
                <select
                  id="floorPreference"
                  name="floorPreference"
                  value={formData.floorPreference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="any">Sin preferencia</option>
                  <option value="low">Planta baja</option>
                  <option value="middle">Planta media</option>
                  <option value="high">Planta alta</option>
                </select>
              </div>

              <div>
                <Label htmlFor="viewPreference">Preferencia de Vista</Label>
                <select
                  id="viewPreference"
                  name="viewPreference"
                  value={formData.viewPreference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="any">Sin preferencia</option>
                  <option value="city">Vista a la ciudad</option>
                  <option value="garden">Vista al jardín</option>
                  <option value="pool">Vista a la piscina</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="specialOccasion">Ocasión Especial</Label>
              <select
                id="specialOccasion"
                name="specialOccasion"
                value={formData.specialOccasion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md mt-1"
              >
                <option value="">Ninguna</option>
                <option value="birthday">Cumpleaños</option>
                <option value="anniversary">Aniversario</option>
                <option value="honeymoon">Luna de miel</option>
                <option value="other">Otra celebración</option>
              </select>
            </div>

            <div>
              <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Indique cualquier solicitud especial que tenga para su estancia"
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-amber-800 mb-2">Nota sobre solicitudes especiales</h3>
              <p className="text-sm text-amber-700">
                Haremos todo lo posible por atender sus solicitudes especiales, pero no podemos garantizar su
                disponibilidad. Le confirmaremos la posibilidad de atender sus solicitudes antes de su llegada.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Servicios Adicionales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-start space-x-3 border p-4 rounded-md">
                  <Checkbox
                    id={service.id}
                    checked={formData.additionalServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <div>
                    <Label htmlFor={service.id} className="font-medium">
                      {service.name} - ${service.price}
                    </Label>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Servicios seleccionados</h3>
              {formData.additionalServices.length === 0 ? (
                <p className="text-sm text-gray-500">No ha seleccionado servicios adicionales</p>
              ) : (
                <ul className="space-y-1">
                  {formData.additionalServices.map((serviceId) => {
                    const service = additionalServices.find((s) => s.id === serviceId)
                    return service ? (
                      <li key={serviceId} className="text-sm flex justify-between">
                        <span>{service.name}</span>
                        <span>${service.price}</span>
                      </li>
                    ) : null
                  })}
                  <li className="text-sm font-medium border-t pt-1 mt-1 flex justify-between">
                    <span>Total servicios adicionales:</span>
                    <span>${servicesTotal}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Información de Contacto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Horarios de Check-in y Check-out</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Check-in:</p>
                  <p>A partir de las 15:00</p>
                </div>
                <div>
                  <p className="font-medium">Check-out:</p>
                  <p>Hasta las 12:00</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Si necesita un horario diferente, por favor indíquelo en las solicitudes especiales.
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pago y Confirmación</h2>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-4">Resumen de la Reserva</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Habitación:</span>
                  <span className="font-medium">{formData.selectedRoomName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fechas:</span>
                  <span>
                    {format(formData.checkIn, "dd/MM/yyyy")} - {format(formData.checkOut, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span>
                    {nights} {nights === 1 ? "noche" : "noches"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Huéspedes:</span>
                  <span>
                    {formData.adults} {formData.adults === 1 ? "adulto" : "adultos"}
                    {formData.children > 0
                      ? `, ${formData.children} ${formData.children === 1 ? "niño" : "niños"}`
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Habitaciones:</span>
                  <span>{formData.rooms}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Precio por noche:</span>
                  <span>${formData.selectedRoomPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal alojamiento:</span>
                  <span>${roomTotal}</span>
                </div>
                {servicesTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Servicios adicionales:</span>
                    <span>${servicesTotal}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border rounded-md p-4">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Tarjeta de Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-md p-4">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-md p-4">
                  <RadioGroupItem value="hotel" id="hotel" />
                  <Label htmlFor="hotel">Pagar en el Hotel</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="Juan Pérez"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/AA"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="savePaymentInfo"
                    checked={formData.savePaymentInfo}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, savePaymentInfo: checked as boolean }))
                    }
                  />
                  <label htmlFor="savePaymentInfo" className="text-sm font-medium leading-none">
                    Guardar información de pago para futuras reservas
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                required
              />
              <label htmlFor="agreeTerms" className="text-sm font-medium leading-none">
                Acepto los términos y condiciones y la política de cancelación
              </label>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-amber-800 mb-2">Política de Cancelación</h3>
              <p className="text-sm text-amber-700">
                Cancelación gratuita hasta 48 horas antes de la fecha de llegada. Las cancelaciones posteriores o la no
                presentación conllevan un cargo del 100% de la primera noche.
              </p>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold">¡Reserva Completada!</h2>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg">
              Su reserva ha sido procesada con éxito. Hemos enviado un correo electrónico de confirmación a{" "}
              {formData.email}.
            </p>
            <div className="bg-gray-50 p-6 rounded-md max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-4">Detalles de la Reserva</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Reserva:</span>
                  <span className="font-medium">RES{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Habitación:</span>
                  <span>{formData.selectedRoomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fechas:</span>
                  <span>
                    {format(formData.checkIn, "dd/MM/yyyy")} - {format(formData.checkOut, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Ir a Mi Panel
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  // Renderizar el indicador de progreso
  const renderProgressBar = () => {
    const steps = ["Fechas", "Habitación", "Personalización", "Servicios", "Contacto", "Pago", "Confirmación"]

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index < currentStep ? "text-primary" : index === currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                      ? "border-2 border-primary text-primary"
                      : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs hidden md:block">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 h-1 bg-primary transition-all"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {currentStep < 7 && renderProgressBar()}

      {renderStep()}

      {currentStep < 7 && (
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <Button type="button" onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isLoading || !formData.agreeTerms}>
              {isLoading ? "Procesando..." : "Completar Reserva"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
