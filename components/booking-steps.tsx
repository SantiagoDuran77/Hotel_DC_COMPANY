// components/booking-steps.tsx
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Calendar, Users, Search, Filter, AlertCircle, CreditCard, Shield, Info, Building, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays, differenceInDays, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { getRooms, createReservation, getCurrentUser } from "@/lib/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
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
  const [maxPrice, setMaxPrice] = useState(500000)
  const [capacity, setCapacity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [paymentTab, setPaymentTab] = useState("hotel")
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
    paymentMethod: "hotel",
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

  // Cargar todas las habitaciones al inicio
  useEffect(() => {
    async function loadRooms() {
      try {
        setIsLoading(true)
        setError(null)
        console.log('🔄 Loading all rooms for booking...')
        const rooms = await getRooms()
        console.log('✅ All rooms loaded from API:', rooms)
        
        // Validar y normalizar las habitaciones
        const validatedRooms = rooms.map((room: any) => {
          // Asegurar que todas las propiedades necesarias existan
          const roomData = {
            id: room.id?.toString() || room.id_habitacion?.toString() || Math.random().toString(),
            name: room.name || `Habitación ${room.number || room.numero_habitacion}`,
            description: room.description || room.descripcion || 'Sin descripción disponible',
            price: Number(room.price) || Number(room.precio) || 0,
            capacity: Number(room.capacity) || Number(room.capacidad) || 1,
            isAvailable: room.isAvailable !== undefined ? room.isAvailable : (room.estado === 'Disponible' || room.estado_habitacion === 'Disponible'),
            amenities: Array.isArray(room.amenities) ? room.amenities : 
                      (room.servicios_incluidos ? 
                        (typeof room.servicios_incluidos === 'string' ? 
                          room.servicios_incluidos.split(',') : 
                          room.servicios_incluidos) 
                        : []),
            images: Array.isArray(room.images) ? room.images : [],
            number: room.number?.toString() || room.numero_habitacion?.toString(),
            tipo: room.tipo || room.tipo_habitacion,
            estado: room.estado || room.estado_habitacion
          }

          console.log('📋 Processed room:', roomData)
          return roomData
        })

        // Calcular precio máximo basado en las habitaciones reales
        const calculatedMaxPrice = validatedRooms.length > 0 
          ? Math.max(...validatedRooms.map(room => room.price || 0)) * 1.1
          : 500000
        
        setMaxPrice(calculatedMaxPrice)
        setAvailableRooms(validatedRooms)
        setFilteredRooms(validatedRooms)
        
        console.log('✅ Final validated rooms:', validatedRooms)
      } catch (error) {
        console.error("❌ Error fetching rooms:", error)
        setError("No se pudieron cargar las habitaciones. Por favor, inténtelo de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadRooms()
  }, [])

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
              room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (room.tipo && room.tipo.toLowerCase().includes(searchTerm.toLowerCase())),
          )
        }

        // Aplicar filtro de precio
        result = result.filter((room) => (room.price || 0) >= minPrice && (room.price || 0) <= maxPrice)

        // Aplicar filtro de capacidad
        result = result.filter((room) => room.capacity >= capacity)

        console.log(`🔍 Filtered ${result.length} rooms from ${availableRooms.length} total`)
        console.log(`💰 Price range: $${minPrice} - $${maxPrice}`)
        console.log(`👥 Capacity: ${capacity}+ guests`)
        
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
      const sanitizedValue = value.replace(/[^\d\s]/g, "").substring(0, 19)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "cardExpiry") {
      const sanitizedValue = value.replace(/[^\d/]/g, "").substring(0, 5)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "cardCvc") {
      const sanitizedValue = value.replace(/\D/g, "").substring(0, 4)
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))
      return
    }

    if (name === "phone") {
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

  // Manejar cambio de fechas
  const handleDateChange = useCallback(
    (field: "checkIn" | "checkOut", date: Date | undefined) => {
      if (!date || !isValid(date)) return

      setFormData((prev) => {
        let newCheckIn = prev.checkIn
        let newCheckOut = prev.checkOut

        if (field === "checkIn") {
          newCheckIn = date.toISOString().split("T")[0]

          if (prev.checkOut) {
            const checkOutDate = new Date(prev.checkOut)
            if (checkOutDate <= date) {
              const nextDay = addDays(date, 1)
              newCheckOut = nextDay.toISOString().split("T")[0]
            }
          } else {
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
        const priceWithDiscount = promoApplied ? basePrice * 0.85 : basePrice
        const subtotal = priceWithDiscount * nights
        const taxes = subtotal * 0.12
        const serviceFee = subtotal * 0.05
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
      if (formData.roomId === room.id || !room.isAvailable) return

      try {
        let checkInDate, checkOutDate, nights

        if (formData.checkIn && formData.checkOut) {
          checkInDate = new Date(formData.checkIn)
          checkOutDate = new Date(formData.checkOut)

          if (isValid(checkInDate) && isValid(checkOutDate)) {
            nights = Math.max(0, differenceInDays(checkOutDate, checkInDate))
          } else {
            const today = new Date()
            const tomorrow = addDays(today, 1)

            checkInDate = today
            checkOutDate = tomorrow
            nights = 1
          }
        } else {
          const today = new Date()
          const tomorrow = addDays(today, 1)

          checkInDate = today
          checkOutDate = tomorrow
          nights = 1
        }

        const checkInStr = checkInDate.toISOString().split("T")[0]
        const checkOutStr = checkOutDate.toISOString().split("T")[0]

        const basePrice = room.price || 0
        const priceWithDiscount = promoApplied ? basePrice * 0.85 : basePrice
        const subtotal = priceWithDiscount * nights
        const taxes = subtotal * 0.12
        const serviceFee = subtotal * 0.05
        const total = subtotal + taxes + serviceFee

        setFormData((prevData) => ({
          ...prevData,
          roomId: room.id,
          roomName: room.name,
          roomImage: room.images?.[0] || '',
          price: basePrice,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          nights: nights,
          subtotal: subtotal,
          taxes: taxes,
          serviceFee: serviceFee,
          total: total,
        }))
        
        console.log('✅ Room selected:', room.id, room.name, 'Price:', basePrice)
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
    if (promoCode.toUpperCase() === "HOTEL15") {
      setPromoApplied(true)

      setFormData((prev) => {
        const priceWithDiscount = prev.price * 0.85
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

  // FUNCIÓN MEJORADA PARA ENVIAR RESERVA
  const submitBooking = useCallback(async () => {
    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('📝 Starting booking process...')

      // Obtener usuario actual para verificar autenticación
      const currentUser = getCurrentUser()
      console.log('👤 Current user for booking:', currentUser)

      if (!currentUser) {
        throw new Error('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.')
      }

      // PREPARAR DATOS DE FORMA COMPATIBLE CON EL BACKEND
      const reservationData = {
        room_id: formData.roomId ? parseInt(formData.roomId) : null,
        start_date: formData.checkIn || null,
        end_date: formData.checkOut || null,
        services: [], // Array vacío por defecto
        guests: formData.guests ? parseInt(formData.guests.toString()) : 1,
        total_price: formData.total ? parseFloat(formData.total.toString()) : 0,
        special_requests: formData.specialRequests || null
      }

      // Validación adicional exhaustiva
      if (!reservationData.room_id || isNaN(reservationData.room_id)) {
        throw new Error('ID de habitación no válido')
      }
      
      if (!reservationData.start_date || !reservationData.end_date) {
        throw new Error('Fechas de reserva no válidas')
      }

      // Validar que las fechas sean correctas
      const startDate = new Date(reservationData.start_date)
      const endDate = new Date(reservationData.end_date)
      
      if (!isValid(startDate) || !isValid(endDate)) {
        throw new Error('Las fechas seleccionadas no son válidas')
      }

      if (startDate >= endDate) {
        throw new Error('La fecha de salida debe ser posterior a la fecha de entrada')
      }

      // Asegurar que no haya valores undefined
      const finalReservationData = {
        room_id: reservationData.room_id,
        start_date: reservationData.start_date,
        end_date: reservationData.end_date,
        services: reservationData.services,
        guests: reservationData.guests,
        total_price: reservationData.total_price,
        special_requests: reservationData.special_requests
      }

      console.log('📦 Final reservation data to send:', finalReservationData)

      const result = await createReservation(finalReservationData)
      console.log('✅ Reservation created:', result)

      setBookingId(result.reservation_id || result.id || `RES-${Date.now()}`)
      setBookingComplete(true)

    } catch (error: any) {
      console.error('❌ Error creating reservation:', error)
      setError(`Error al crear la reserva: ${error.message}`)
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
            <div className="w-24 h-24 relative rounded-md overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
              {formData.roomImage ? (
                <Image 
                  src={formData.roomImage} 
                  alt={formData.roomName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Imagen</span>
              )}
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
            {formData.paymentMethod === "hotel" && (
              <div className="flex items-start">
                <Wallet className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Pago en el Hotel</p>
                  <p className="text-blue-700">
                    Deberá realizar el pago al momento del check-in. Aceptamos efectivo y tarjetas.
                  </p>
                </div>
              </div>
            )}
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

          {/* HABITACIONES SIEMPRE VISIBLES */}
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
                    <Label htmlFor="priceRange">Rango de Precio (${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()})</Label>
                    <div className="flex items-center space-x-2 mt-1">
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
                        onChange={(e) => setMaxPrice(Math.max(minPrice, Number.parseInt(e.target.value, 10) || maxPrice))}
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
                <div className="mt-2 text-sm text-gray-600">
                  Mostrando {filteredRooms.length} de {availableRooms.length} habitaciones
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
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setMinPrice(0)
                    setMaxPrice(500000)
                    setCapacity(1)
                    setSearchTerm("")
                  }}
                >
                  Restablecer filtros
                </Button>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`border rounded-lg overflow-hidden ${
                      formData.roomId === room.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row cursor-pointer">
                      <div className="md:w-1/3 relative h-48 md:h-auto">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          {room.images && room.images[0] ? (
                            <Image 
                              src={room.images[0]} 
                              alt={room.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">Imagen de habitación</span>
                          )}
                        </div>
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
                          {room.amenities?.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities && room.amenities.length > 3 && (
                            <Badge variant="outline">+{room.amenities.length - 3} más</Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div>
                            <span className="text-2xl font-bold">${(room.price || 0).toLocaleString()}</span>
                            <span className="text-gray-500"> / noche</span>
                          </div>

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
                ))}
              </div>
            ) : (
              <RoomSelectorCinema 
                onSelectRoom={handleRoomSelect} 
                selectedRoomId={formData.roomId} 
                rooms={filteredRooms}
              />
            )}
          </div>

          {formData.roomId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Habitación Seleccionada</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 mr-3 bg-gray-200 flex items-center justify-center rounded-md">
                  {formData.roomImage ? (
                    <Image 
                      src={formData.roomImage} 
                      alt={formData.roomName}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Imagen</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{formData.roomName}</p>
                  <p className="text-sm text-gray-600">
                    {formData.nights} {formData.nights === 1 ? "noche" : "noches"} x ${formData.price.toLocaleString()} = $
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
                  ${promoApplied ? (formData.price * 0.85).toFixed(2) : formData.price.toLocaleString()} x {formData.nights}{" "}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={paymentTab} onValueChange={setPaymentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hotel">
                    <Building className="h-4 w-4 mr-2" />
                    Pagar en Hotel
                  </TabsTrigger>
                  <TabsTrigger value="credit-card">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Tarjeta
                  </TabsTrigger>
                  <TabsTrigger value="paypal">
                    <Shield className="h-4 w-4 mr-2" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hotel" className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <Building className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-center mb-2">Pagar en el Hotel</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Reserve ahora y pague directamente en el hotel al momento del check-in.
                    </p>
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Ventajas de pagar en el hotel:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Sin cargos anticipados
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Flexibilidad de pago (efectivo o tarjeta)
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Cancelación gratuita hasta 48 horas antes
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="credit-card" className="space-y-4 mt-4">
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
                      placeholder="JUAN PEREZ"
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
                        placeholder="MM/YY"
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
                </TabsContent>

                <TabsContent value="paypal" className="text-center mt-4">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Pago Seguro con PayPal</h3>
                    <p className="text-gray-600 mb-4">
                      Serás redirigido a PayPal para completar tu pago de manera segura.
                    </p>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                      Pagar con PayPal
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Resumen de Reserva</h3>

                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 mr-3 bg-gray-200 flex items-center justify-center rounded-md">
                    {formData.roomImage ? (
                      <Image 
                        src={formData.roomImage} 
                        alt={formData.roomName}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">Imagen</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{formData.roomName}</p>
                    <p className="text-sm text-gray-600">
                      {formData.nights} {formData.nights === 1 ? "noche" : "noches"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span>
                      {formData.checkIn ? format(new Date(formData.checkIn), "PPP", { locale: es }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span>
                      {formData.checkOut ? format(new Date(formData.checkOut), "PPP", { locale: es }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Huéspedes</span>
                    <span>{formData.guests}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
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
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Atrás
            </Button>
            <Button onClick={nextStep}>Continuar a Confirmación</Button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Confirmación de Reserva</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Términos y Condiciones</h3>

                <div className="space-y-4 max-h-60 overflow-y-auto p-4 bg-white rounded-md">
                  <div>
                    <h4 className="font-medium mb-2">Política de Cancelación</h4>
                    <p className="text-sm text-gray-600">
                      Puedes cancelar tu reserva de forma gratuita hasta 48 horas antes de tu fecha de check-in. 
                      Las cancelaciones realizadas con menos de 48 horas de antelación estarán sujetas a un cargo 
                      equivalente a la primera noche de estancia.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Política de No Show</h4>
                    <p className="text-sm text-gray-600">
                      En caso de no presentarse el día del check-in sin previa cancelación, se cobrará el importe 
                      total de la estancia reservada.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Política de Huéspedes</h4>
                    <p className="text-sm text-gray-600">
                      El número de huéspedes no puede exceder la capacidad máxima de la habitación. 
                      Se requiere identificación válida para todos los huéspedes al momento del check-in.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Horarios</h4>
                    <p className="text-sm text-gray-600">
                      Check-in: a partir de las 15:00 | Check-out: hasta las 12:00. 
                      Horarios fuera de este rango están sujetos a disponibilidad y pueden generar cargos adicionales.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los términos y condiciones y la política de privacidad
                  </Label>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-600">
                  Al completar esta reserva, aceptas nuestras políticas y autorizas el cargo correspondiente 
                  en tu método de pago.
                </AlertDescription>
              </Alert>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Resumen Final</h3>

                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 mr-3 bg-gray-200 flex items-center justify-center rounded-md">
                    {formData.roomImage ? (
                      <Image 
                        src={formData.roomImage} 
                        alt={formData.roomName}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">Imagen</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{formData.roomName}</p>
                    <p className="text-sm text-gray-600">
                      {formData.nights} {formData.nights === 1 ? "noche" : "noches"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fechas</span>
                    <span className="text-right">
                      {formData.checkIn ? format(new Date(formData.checkIn), "dd/MM/yy") : "N/A"} -{" "}
                      {formData.checkOut ? format(new Date(formData.checkOut), "dd/MM/yy") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Huéspedes</span>
                    <span>{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago</span>
                    <span className="capitalize">
                      {formData.paymentMethod === "hotel" ? "Pago en Hotel" : 
                       formData.paymentMethod === "credit-card" ? "Tarjeta de Crédito" : 
                       "PayPal"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total a Pagar</span>
                    <span>${formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Atrás
            </Button>
            <Button onClick={submitBooking} disabled={isLoading || !termsAccepted}>
              {isLoading ? "Procesando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}