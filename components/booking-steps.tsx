"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Calendar, Users, Search, Filter, AlertCircle, CreditCard, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays, differenceInDays, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { getRooms } from "@/lib/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import ImageCarousel from "@/components/image-carousel"
import type { Room } from "@/lib/types"
import RoomSelectorCinema from "./room-selector-cinema"

export default function BookingSteps() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Estados principales
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [capacity, setCapacity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [paymentTab, setPaymentTab] = useState("credit-card")
  const [viewMode, setViewMode] = useState<"list" | "cinema">("list")

  // Form data
  const [formData, setFormData] = useState({
    roomId: "",
    roomName: "",
    roomImage: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    price: 0,
    nights: 0,
    total: 0,
    subtotal: 0,
    taxes: 0,
    serviceFee: 0,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  // Cargar parámetros de URL solo una vez al inicio
  useEffect(() => {
    try {
      const roomId = searchParams.get("roomId") || ""
      const checkIn = searchParams.get("checkIn") || ""
      const checkOut = searchParams.get("checkOut") || ""
      const guests = Number.parseInt(searchParams.get("guests") || "1", 10)
      const price = Number.parseFloat(searchParams.get("price") || "0")
      const nights = Number.parseInt(searchParams.get("nights") || "0", 10)
      const total = Number.parseFloat(searchParams.get("total") || "0")
      const discount = searchParams.get("discount") === "true"

      // Validar que los valores numéricos sean realmente números
      const validGuests = isNaN(guests) ? 1 : guests
      const validPrice = isNaN(price) ? 0 : price
      const validNights = isNaN(nights) ? 0 : nights
      const validTotal = isNaN(total) ? 0 : total

      // Validar fechas
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const validCheckIn = isValid(checkInDate) ? checkIn : ""
      const validCheckOut = isValid(checkOutDate) ? checkOut : ""

      // Si hay descuento, aplicarlo
      if (discount) {
        setPromoApplied(true)
      }

      setFormData((prev) => ({
        ...prev,
        roomId,
        checkIn: validCheckIn,
        checkOut: validCheckOut,
        guests: validGuests,
        price: validPrice,
        nights: validNights,
        total: validTotal,
      }))

      setCapacity(validGuests)
    } catch (err) {
      console.error("Error parsing URL parameters:", err)
      setError("Hubo un problema al cargar los parámetros de la URL.")
    }
  }, [searchParams])

  // Cargar habitaciones solo una vez
  useEffect(() => {
    async function loadRooms() {
      try {
        setIsLoading(true)
        setError(null)
        const rooms = await getRooms()
        setAvailableRooms(rooms)
        setFilteredRooms(rooms) // Inicializar filteredRooms con todas las habitaciones
      } catch (error) {
        console.error("Error fetching rooms:", error)
        setError("No se pudieron cargar las habitaciones. Por favor, inténtelo de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadRooms()
  }, [])

  // Función para filtrar habitaciones - separada del useEffect
  const filterRooms = useCallback(() => {
    if (availableRooms.length === 0) return

    try {
      let result = [...availableRooms]

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        result = result.filter(
          (room) =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Aplicar filtro de precio
      result = result.filter((room) => room.price >= minPrice && room.price <= maxPrice)

      // Aplicar filtro de capacidad
      result = result.filter((room) => room.capacity >= capacity)

      setFilteredRooms(result)
    } catch (err) {
      console.error("Error filtering rooms:", err)
    }
  }, [availableRooms, searchTerm, minPrice, maxPrice, capacity])

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    const applyFilters = () => {
      if (availableRooms.length === 0) return

      try {
        let result = [...availableRooms]

        // Aplicar filtro de búsqueda
        if (searchTerm) {
          result = result.filter(
            (room) =>
              room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              room.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        // Aplicar filtro de precio
        result = result.filter((room) => room.price >= minPrice && room.price <= maxPrice)

        // Aplicar filtro de capacidad
        result = result.filter((room) => room.capacity >= capacity)

        setFilteredRooms(result)
      } catch (err) {
        console.error("Error filtering rooms:", err)
      }
    }

    applyFilters()
  }, [availableRooms, searchTerm, minPrice, maxPrice, capacity])

  // Manejadores de eventos
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Validación específica para campos de tarjeta
    if (name === "cardNumber") {
      // Solo permitir números y espacios, máximo 19 caracteres (16 números + 3 espacios)
      const sanitizedValue = value.replace(/[^\d\s]/g, "").substring(0, 19)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "cardExpiry") {
      // Formato MM/YY, solo permitir números y /
      const sanitizedValue = value.replace(/[^\d/]/g, "").substring(0, 5)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "cardCvc") {
      // Solo permitir 3-4 dígitos
      const sanitizedValue = value.replace(/\D/g, "").substring(0, 4)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "phone") {
      // Solo permitir números, +, espacios y guiones
      const sanitizedValue = value.replace(/[^\d+\s-]/g, "")
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    // Para el resto de campos, actualizar normalmente
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleDateChange = useCallback(
    (field: "checkIn" | "checkOut", date: Date | undefined) => {
      if (!date || !isValid(date)) return

      setFormData((prev) => {
        let newCheckIn = prev.checkIn
        let newCheckOut = prev.checkOut

        if (field === "checkIn") {
          newCheckIn = date.toISOString().split("T")[0]

          // Si la fecha de salida es anterior a la nueva fecha de entrada, ajustarla
          if (prev.checkOut) {
            const checkOutDate = new Date(prev.checkOut)
            if (checkOutDate <= date) {
              const nextDay = addDays(date, 1)
              newCheckOut = nextDay.toISOString().split("T")[0]
            }
          } else {
            // Si no hay fecha de salida, establecerla a un día después
            const nextDay = addDays(date, 1)
            newCheckOut = nextDay.toISOString().split("T")[0]
          }
        } else {
          newCheckOut = date.toISOString().split("T")[0]
        }

        // Calcular noches y total
        let nights = 0
        if (newCheckIn && newCheckOut) {
          const startDate = new Date(newCheckIn)
          const endDate = new Date(newCheckOut)
          if (isValid(startDate) && isValid(endDate)) {
            nights = Math.max(0, differenceInDays(endDate, startDate))
          }
        }

        // Calcular precios
        const basePrice = prev.price
        const priceWithDiscount = promoApplied ? basePrice * 0.85 : basePrice // 15% de descuento si hay promo
        const subtotal = priceWithDiscount * nights
        const taxes = subtotal * 0.12 // 12% de impuestos
        const serviceFee = subtotal * 0.05 // 5% de tarifa de servicio
        const total = subtotal + taxes + serviceFee

        return {
          ...prev,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          nights,
          subtotal,
          taxes,
          serviceFee,
          total,
        }
      })
    },
    [promoApplied],
  )

  // Función mejorada para seleccionar habitación
  const handleRoomSelect = useCallback(
    (room: Room) => {
      // Prevent updates if the same room is already selected or if room is not available
      if (formData.roomId === room.id || !room.isAvailable) return

      try {
        // Generate multiple images for the carousel
        const roomImages = [
          room.image || "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600&text=Vista+1",
          "/placeholder.svg?height=400&width=600&text=Vista+2",
          "/placeholder.svg?height=400&width=600&text=Baño",
        ]

        // Calculate nights and total
        let checkInDate, checkOutDate, nights

        if (formData.checkIn && formData.checkOut) {
          checkInDate = new Date(formData.checkIn)
          checkOutDate = new Date(formData.checkOut)

          if (isValid(checkInDate) && isValid(checkOutDate)) {
            nights = Math.max(0, differenceInDays(checkOutDate, checkInDate))
          } else {
            // Si las fechas no son válidas, establecer fechas predeterminadas
            const today = new Date()
            const tomorrow = addDays(today, 1)

            checkInDate = today
            checkOutDate = tomorrow
            nights = 1
          }
        } else {
          // Si no hay fechas seleccionadas, establecer fechas predeterminadas
          const today = new Date()
          const tomorrow = addDays(today, 1)

          checkInDate = today
          checkOutDate = tomorrow
          nights = 1
        }

        const checkInStr = checkInDate.toISOString().split("T")[0]
        const checkOutStr = checkOutDate.toISOString().split("T")[0]

        // Calcular precios
        const basePrice = room.price
        const priceWithDiscount = promoApplied ? basePrice * 0.85 : basePrice // 15% de descuento si hay promo
        const subtotal = priceWithDiscount * nights
        const taxes = subtotal * 0.12 // 12% de impuestos
        const serviceFee = subtotal * 0.05 // 5% de tarifa de servicio
        const total = subtotal + taxes + serviceFee

        // Update state with all calculated values
        setFormData((prevData) => ({
          ...prevData,
          roomId: room.id,
          roomName: room.name,
          roomImage: room.image,
          price: room.price,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          nights: nights,
          subtotal: subtotal,
          taxes: taxes,
          serviceFee: serviceFee,
          total: total,
        }))
      } catch (err) {
        console.error("Error selecting room:", err)
      }
    },
    [formData.roomId, formData.checkIn, formData.checkOut, promoApplied],
  )

  const handleGuestsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const guests = Number.parseInt(e.target.value, 10)
      if (isNaN(guests) || guests < 1) return

      setFormData((prev) => ({ ...prev, guests }))
      setCapacity(guests)
    } catch (err) {
      console.error("Error changing guests:", err)
    }
  }, [])

  const handleApplyPromo = () => {
    // Simular validación de código promocional
    if (promoCode.toUpperCase() === "HOTEL15") {
      setPromoApplied(true)

      // Recalcular precios con descuento
      setFormData((prev) => {
        const priceWithDiscount = prev.price * 0.85 // 15% de descuento
        const subtotal = priceWithDiscount * prev.nights
        const taxes = subtotal * 0.12
        const serviceFee = subtotal * 0.05
        const total = subtotal + taxes + serviceFee

        return {
          ...prev,
          subtotal,
          taxes,
          serviceFee,
          total,
        }
      })

      setError(null)
    } else {
      setError("Código promocional inválido. Intente con HOTEL15")
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep = useCallback(
    (currentStep: number): boolean => {
      setError(null)

      if (currentStep === 1) {
        if (!formData.roomId) {
          setError("Por favor, seleccione una habitación")
          return false
        }
        if (!formData.checkIn || !formData.checkOut) {
          setError("Por favor, seleccione las fechas de entrada y salida")
          return false
        }
        if (!formData.name) {
          setError("Por favor, ingrese su nombre completo")
          return false
        }
        if (!formData.email) {
          setError("Por favor, ingrese su correo electrónico")
          return false
        }
        if (!validateEmail(formData.email)) {
          setError("Por favor, ingrese un correo electrónico válido")
          return false
        }
        if (!formData.phone) {
          setError("Por favor, ingrese su número de teléfono")
          return false
        }
        return true
      }

      if (currentStep === 2) {
        if (paymentTab === "credit-card") {
          if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 13) {
            setError("Por favor, ingrese un número de tarjeta válido")
            return false
          }
          if (!formData.cardName) {
            setError("Por favor, ingrese el nombre que aparece en la tarjeta")
            return false
          }
          if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
            setError("Por favor, ingrese una fecha de expiración válida (MM/YY)")
            return false
          }
          if (!formData.cardCvc || formData.cardCvc.length < 3) {
            setError("Por favor, ingrese un código CVC válido")
            return false
          }
        }
        return true
      }

      if (currentStep === 3) {
        if (!termsAccepted) {
          setError("Debe aceptar los términos y condiciones para continuar")
          return false
        }
        return true
      }

      return true
    },
    [formData, termsAccepted, paymentTab],
  )

  const nextStep = useCallback(() => {
    // Validar el paso actual
    if (!validateStep(step)) {
      return
    }

    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }, [step, validateStep])

  const prevStep = useCallback(() => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }, [])

  const submitBooking = useCallback(async () => {
    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setBookingId(data.bookingId)
        setBookingComplete(true)
      } else {
        setError("Reserva fallida: " + (data.error || "Error desconocido"))
      }
    } catch (error) {
      console.error("Error al procesar la reserva:", error)
      setError("Ocurrió un error al procesar su reserva. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateStep])

  // Renderizar confirmación de reserva
  if (bookingComplete) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600 text-lg">
            Su reserva ha sido confirmada con éxito. Hemos enviado un correo electrónico de confirmación con todos los
            detalles a <span className="font-medium">{formData.email}</span>.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Detalles de la Reserva</h3>
            <Badge className="bg-green-600">Confirmada</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Número de Reserva</p>
              <p className="font-medium text-lg">{bookingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Reserva</p>
              <p className="font-medium">{format(new Date(), "PPP", { locale: es })}</p>
            </div>
          </div>

          <div className="flex mb-6">
            <div className="w-24 h-24 relative rounded-md overflow-hidden mr-4">
              <Image
                src={formData.roomImage || "/placeholder.svg"}
                alt={formData.roomName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{formData.roomName}</h4>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {formData.checkIn ? format(new Date(formData.checkIn), "PPP", { locale: es }) : "N/A"} -
                  {formData.checkOut ? format(new Date(formData.checkOut), "PPP", { locale: es }) : "N/A"}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{formData.guests} huéspedes</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Subtotal</span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between mb-1 text-green-600">
                <span>Descuento (15%)</span>
                <span>-${(formData.price * 0.15 * formData.nights).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Impuestos</span>
              <span>${formData.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Tarifa de servicio</span>
              <span>${formData.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Información Importante</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Horarios de Check-in y Check-out</p>
                <p className="text-blue-700">Check-in: a partir de las 15:00 | Check-out: hasta las 12:00</p>
              </div>
            </div>
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Política de Cancelación</p>
                <p className="text-blue-700">Cancelación gratuita hasta 48 horas antes de la fecha de llegada.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Documentación Necesaria</p>
                <p className="text-blue-700">
                  Todos los huéspedes deben presentar un documento de identidad válido al momento del check-in.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={() => router.push("/")} variant="outline">
            Volver al Inicio
          </Button>
          <Button onClick={() => router.push("/dashboard/reservations")}>Ver Mis Reservas</Button>
        </div>
      </div>
    )
  }

  // Renderizar pasos de reserva
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Indicador de pasos */}
      <div className="flex justify-between items-center mb-8">
        <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </div>
          <span className="font-medium">Información</span>
        </div>
        <div className="h-px w-16 bg-gray-300"></div>
        <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
          >
            2
          </div>
          <span className="font-medium">Pago</span>
        </div>
        <div className="h-px w-16 bg-gray-300"></div>
        <div className={`flex items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
          >
            3
          </div>
          <span className="font-medium">Confirmación</span>
        </div>
      </div>

      {/* Mostrar mensajes de error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Paso 1: Información del huésped */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Información del Huésped</h2>

          {/* Selección de fechas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Fechas de Estancia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Fecha de Llegada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.checkIn ? (
                        format(new Date(formData.checkIn), "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.checkIn ? new Date(formData.checkIn) : undefined}
                      onSelect={(date) => handleDateChange("checkIn", date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="checkOut">Fecha de Salida</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.checkOut ? (
                        format(new Date(formData.checkOut), "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.checkOut ? new Date(formData.checkOut) : undefined}
                      onSelect={(date) => handleDateChange("checkOut", date)}
                      initialFocus
                      disabled={(date) =>
                        date < new Date() || (formData.checkIn ? date <= new Date(formData.checkIn) : false)
                      }
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <Label htmlFor="guests" className="mr-2">
                Huéspedes:
              </Label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleGuestsChange}
                className="border rounded-md px-3 py-1"
                aria-label="Número de huéspedes"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "huésped" : "huéspedes"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selección de habitación */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Selección de Habitación</h3>

            <div className="flex items-center mb-4 space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar habitaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Buscar habitaciones"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={18} className="mr-2" />
                Filtros
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  Lista
                </Button>
                <Button
                  variant={viewMode === "cinema" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cinema")}
                  className="rounded-l-none"
                >
                  Cine
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Filtros</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceRange">Rango de Precio</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
                        className="w-24"
                        min="0"
                        aria-label="Precio mínimo"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Math.max(minPrice, Number.parseInt(e.target.value, 10) || 0))}
                        className="w-24"
                        min={minPrice}
                        aria-label="Precio máximo"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidad Mínima</Label>
                    <select
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(Number.parseInt(e.target.value, 10))}
                      className="w-full border rounded-md px-3 py-1 mt-1"
                      aria-label="Capacidad mínima"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "persona" : "personas"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <p>Cargando habitaciones disponibles...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-8 bg-amber-50 rounded-lg">
                <p className="text-amber-800">No se encontraron habitaciones que coincidan con sus criterios.</p>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {filteredRooms.map((room) => {
                  // Generar múltiples imágenes para el carrusel
                  const roomImages = [
                    room.image || "/placeholder.svg?height=400&width=600",
                    "/placeholder.svg?height=400&width=600&text=Vista+1",
                    "/placeholder.svg?height=400&width=600&text=Vista+2",
                    "/placeholder.svg?height=400&width=600&text=Baño",
                  ]

                  return (
                    <div
                      key={room.id}
                      className={`border rounded-lg overflow-hidden ${
                        formData.roomId === room.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                    >
                      <div className="flex flex-col md:flex-row cursor-pointer">
                        <div className="md:w-1/3 relative h-48 md:h-auto">
                          <ImageCarousel
                            images={roomImages}
                            alt={room.name}
                            aspectRatio="video"
                            showThumbnails={false}
                          />
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-medium ${
                              room.isAvailable ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {room.isAvailable ? "Disponible" : "No disponible"}
                          </div>
                        </div>
                        <div className="md:w-2/3 p-4" onClick={() => room.isAvailable && handleRoomSelect(room)}>
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold">{room.name}</h4>
                            {formData.roomId === room.id && <Badge className="bg-primary">Seleccionada</Badge>}
                          </div>

                          <div className="flex items-center text-gray-600 mt-2">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Hasta {room.capacity} huéspedes</span>
                          </div>

                          <p className="text-gray-600 mt-2 line-clamp-2">{room.description}</p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="outline">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 3 && (
                              <Badge variant="outline">+{room.amenities.length - 3} más</Badge>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div>
                              <span className="text-2xl font-bold">${room.price}</span>
                              <span className="text-gray-500"> / noche</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Actualizar la disponibilidad de la habitación
                                  setFilteredRooms((prevRooms) =>
                                    prevRooms.map((r) =>
                                      r.id === room.id ? { ...r, isAvailable: !r.isAvailable } : r,
                                    ),
                                  )
                                  // También actualizar en availableRooms
                                  setAvailableRooms((prevRooms) =>
                                    prevRooms.map((r) =>
                                      r.id === room.id ? { ...r, isAvailable: !r.isAvailable } : r,
                                    ),
                                  )
                                }}
                              >
                                {room.isAvailable ? "Marcar como ocupada" : "Marcar como disponible"}
                              </Button>
                              <Button
                                variant={formData.roomId === room.id ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (room.isAvailable) {
                                    handleRoomSelect(room)
                                  }
                                }}
                                disabled={!room.isAvailable}
                              >
                                {!room.isAvailable
                                  ? "No disponible"
                                  : formData.roomId === room.id
                                    ? "Seleccionada"
                                    : "Seleccionar"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <RoomSelectorCinema onSelectRoom={handleRoomSelect} selectedRoomId={formData.roomId} />
            )}
          </div>

          {formData.roomId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Habitación Seleccionada</h3>
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-3">
                  <Image
                    src={formData.roomImage || "/placeholder.svg"}
                    alt={formData.roomName}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="font-medium">{formData.roomName}</p>
                  <p className="text-sm text-gray-600">
                    {formData.nights} {formData.nights === 1 ? "noche" : "noches"} x ${formData.price} = $
                    {formData.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Código promocional */}
          {formData.roomId && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">¿Tienes un código promocional?</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Ingresa tu código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleApplyPromo} disabled={!promoCode}>
                  Aplicar
                </Button>
              </div>
              {promoApplied && (
                <Alert className="mt-2 bg-green-50 border-green-200">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    ¡Código promocional aplicado! 15% de descuento.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Información personal */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
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

            <div>
              <Label htmlFor="specialRequests">Solicitudes Especiales (Opcional)</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          {formData.roomId && formData.checkIn && formData.checkOut && (
            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ${promoApplied ? (formData.price * 0.85).toFixed(2) : formData.price} x {formData.nights}{" "}
                  {formData.nights === 1 ? "noche" : "noches"}
                </span>
                <span>${formData.subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento (15%)</span>
                  <span>-${(formData.price * 0.15 * formData.nights).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (12%)</span>
                <span>${formData.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarifa de servicio</span>
                <span>${formData.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              onClick={nextStep}
              disabled={
                !formData.roomId ||
                !formData.checkIn ||
                !formData.checkOut ||
                !formData.name ||
                !formData.email ||
                !formData.phone
              }
            >
              Continuar al Pago
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Información de pago */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Información de Pago</h2>

          <div className="mb-6">
            <Tabs value={paymentTab} onValueChange={setPaymentTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="credit-card"
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "credit-card" }))}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Tarjeta de Crédito
                </TabsTrigger>
                <TabsTrigger
                  value="paypal"
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "paypal" }))}
                >
                  <span className="font-bold text-blue-600">Pay</span>
                  <span className="font-bold text-blue-800">Pal</span>
                </TabsTrigger>
                <TabsTrigger value="hotel" onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "hotel" }))}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Pagar en Hotel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credit-card" className="mt-4">
                <div className="space-y-4 bg-white p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      aria-describedby="cardNumberHint"
                    />
                    <p id="cardNumberHint" className="text-xs text-gray-500 mt-1">
                      Ingrese los 16 dígitos de su tarjeta sin espacios
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                    <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        aria-describedby="cardExpiryHint"
                      />
                      <p id="cardExpiryHint" className="text-xs text-gray-500 mt-1">
                        Formato: MM/YY (ej. 12/25)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        aria-describedby="cardCvcHint"
                      />
                      <p id="cardCvcHint" className="text-xs text-gray-500 mt-1">
                        3 o 4 dígitos en el reverso de la tarjeta
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">
                      Sus datos de pago están protegidos con encriptación SSL
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paypal" className="mt-4">
                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">Pay</span>
                    <span className="text-2xl font-bold text-blue-800">Pal</span>
                  </div>
                  <p className="mb-4">Será redirigido a PayPal para completar su pago de forma segura.</p>
                  <p className="text-sm text-gray-600">
                    Nota: Asegúrese de tener su cuenta de PayPal lista para el proceso de pago.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="hotel" className="mt-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Pago en el Hotel</h3>
                  <p className="mb-4">
                    Reserve ahora y pague durante su estancia. No se realizará ningún cargo a su tarjeta en este
                    momento.
                  </p>
                  <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-600">
                      Se requiere una tarjeta de crédito válida para garantizar su reserva. Se aplicará un cargo de una
                      noche en caso de no presentarse.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Resumen de la Reserva</h3>
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={formData.roomImage || "/placeholder.svg"}
                  alt={formData.roomName}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <p className="font-medium">{formData.roomName}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {formData.checkIn ? format(new Date(formData.checkIn), "PPP", { locale: es }) : "N/A"} -
                      {formData.checkOut ? format(new Date(formData.checkOut), "PPP", { locale: es }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{formData.guests} huéspedes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">
                  ${promoApplied ? (formData.price * 0.85).toFixed(2) : formData.price} x {formData.nights}{" "}
                  {formData.nights === 1 ? "noche" : "noches"}
                </span>
                <span>${formData.subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento (15%)</span>
                  <span>-${(formData.price * 0.15 * formData.nights).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (12%)</span>
                <span>${formData.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarifa de servicio</span>
                <span>${formData.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Volver
            </Button>
            <Button onClick={nextStep}>Revisar Reserva</Button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Revisar su Reserva</h2>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Habitación Seleccionada</h3>
            <div className="flex items-center mb-3">
              <div className="relative w-20 h-20 mr-3">
                <Image
                  src={formData.roomImage || "/placeholder.svg"}
                  alt={formData.roomName}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <p className="font-medium">{formData.roomName}</p>
                <p className="text-sm text-gray-600">
                  {formData.nights} {formData.nights === 1 ? "noche" : "noches"} x ${formData.price} = $
                  {formData.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Detalles de la Reserva</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Check-in:</div>
              <div>{formData.checkIn ? format(new Date(formData.checkIn), "PPP", { locale: es }) : "N/A"}</div>
              <div className="text-gray-600">Check-out:</div>
              <div>{formData.checkOut ? format(new Date(formData.checkOut), "PPP", { locale: es }) : "N/A"}</div>
              <div className="text-gray-600">Huéspedes:</div>
              <div>{formData.guests}</div>
              <div className="text-gray-600">Noches:</div>
              <div>{formData.nights}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Información del Huésped</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Nombre:</div>
              <div>{formData.name}</div>
              <div className="text-gray-600">Email:</div>
              <div>{formData.email}</div>
              <div className="text-gray-600">Teléfono:</div>
              <div>{formData.phone}</div>
              {formData.specialRequests && (
                <>
                  <div className="text-gray-600">Solicitudes Especiales:</div>
                  <div>{formData.specialRequests}</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Información de Pago</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Método de Pago:</div>
              <div>
                {formData.paymentMethod === "credit-card" && "Tarjeta de Crédito"}
                {formData.paymentMethod === "paypal" && "PayPal"}
                {formData.paymentMethod === "hotel" && "Pago en el Hotel"}
              </div>
              {formData.paymentMethod === "credit-card" && formData.cardNumber && (
                <>
                  <div className="text-gray-600">Número de Tarjeta:</div>
                  <div>**** **** **** {formData.cardNumber.slice(-4)}</div>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">
                ${promoApplied ? (formData.price * 0.85).toFixed(2) : formData.price} x {formData.nights}{" "}
                {formData.nights === 1 ? "noche" : "noches"}
              </span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Descuento (15%)</span>
                <span>-${(formData.price * 0.15 * formData.nights).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos (12%)</span>
              <span>${formData.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tarifa de servicio</span>
              <span>${formData.serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Total</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los términos y condiciones y la política de cancelación
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Volver
            </Button>
            <Button onClick={submitBooking} disabled={isLoading || !termsAccepted}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "Confirmar Reserva"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
