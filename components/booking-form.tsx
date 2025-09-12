"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CreditCard, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, differenceInDays, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ServicesSelector from "./booking/services-selector"

interface BookingFormProps {
  roomId: string
  price: number
}

export default function BookingForm({ roomId, price }: BookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [showPromoField, setShowPromoField] = useState(false)

  // Estados para servicios
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0

  // Calcular precio con descuento si se aplica un código promocional
  const discount = promoApplied ? 0.15 : 0 // 15% de descuento
  const roomPriceWithDiscount = price * (1 - discount)

  // Calcular precios
  const roomSubtotal = nights * roomPriceWithDiscount
  const servicesTotal = calculateServicesTotal()
  const subtotal = roomSubtotal + servicesTotal
  const taxes = subtotal * 0.12 // 12% de impuestos
  const serviceFee = subtotal * 0.05 // 5% de tarifa de servicio
  const totalPrice = subtotal + taxes + serviceFee

  function calculateServicesTotal() {
    // Esta función debería estar definida en el componente ServicesSelector
    // Por ahora, haremos un cálculo básico
    return 0
  }

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date)

    if (date && checkOut && checkOut <= date) {
      setCheckOut(addDays(date, 1))
    }

    if (date && !checkOut) {
      setCheckOut(addDays(date, 1))
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "HOTEL15") {
      setPromoApplied(true)
    } else {
      alert("Código promocional inválido")
    }
  }

  const handleServiceChange = (serviceId: string, selected: boolean) => {
    if (selected) {
      setSelectedServices([...selectedServices, serviceId])
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    }
  }

  const handlePackageChange = (packageId: string, selected: boolean) => {
    if (selected) {
      setSelectedPackages([...selectedPackages, packageId])
    } else {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId))
    }
  }

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Por favor seleccione fechas de entrada y salida")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const params = new URLSearchParams()
      params.append("roomId", roomId)
      params.append("checkIn", format(checkIn, "yyyy-MM-dd"))
      params.append("checkOut", format(checkOut, "yyyy-MM-dd"))
      params.append("guests", guests.toString())
      params.append("price", roomPriceWithDiscount.toString())
      params.append("nights", nights.toString())
      params.append("total", totalPrice.toString())
      params.append("discount", promoApplied ? "true" : "false")
      params.append("services", JSON.stringify(selectedServices))
      params.append("packages", JSON.stringify(selectedPackages))

      router.push(`/booking?${params.toString()}`)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dates">Fechas y Huéspedes</TabsTrigger>
          <TabsTrigger value="services">Servicios Adicionales</TabsTrigger>
        </TabsList>

        <TabsContent value="dates" className="space-y-4">
          <div>
            <Label htmlFor="check-in">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                  id="check-in"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={handleCheckInChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="check-out">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                  id="check-out"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => (checkIn ? date <= checkIn : false) || date < new Date()}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="guests">Huéspedes</Label>
            <div className="flex items-center mt-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="h-10 w-10"
              >
                -
              </Button>
              <div className="w-full text-center">
                <span className="text-lg font-medium">{guests}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                disabled={guests >= 10}
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          {showPromoField ? (
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Input
                  id="promoCode"
                  placeholder="Código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <Button onClick={handleApplyPromo} variant="outline" disabled={!promoCode}>
                Aplicar
              </Button>
            </div>
          ) : (
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setShowPromoField(true)}>
              ¿Tienes un código promocional?
            </Button>
          )}

          {promoApplied && (
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                ¡Código promocional aplicado! 15% de descuento.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServicesSelector
            selectedServices={selectedServices}
            selectedPackages={selectedPackages}
            onServiceChange={handleServiceChange}
            onPackageChange={handlePackageChange}
          />
        </TabsContent>
      </Tabs>

      {nights > 0 && (
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Habitación: ${roomPriceWithDiscount} x {nights} {nights === 1 ? "noche" : "noches"}
            </span>
            <span>${roomSubtotal.toFixed(2)}</span>
          </div>

          {servicesTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Servicios adicionales</span>
              <span>${servicesTotal.toFixed(2)}</span>
            </div>
          )}

          {promoApplied && (
            <div className="flex justify-between text-green-600">
              <span>Descuento (15%)</span>
              <span>-${(price * discount * nights).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Impuestos (12%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tarifa de servicio</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Badge variant="outline" className="mb-2">
          Cancelación gratuita hasta 48h antes
        </Badge>
        <Button onClick={handleBookNow} className="w-full" disabled={!checkIn || !checkOut || isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </span>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Reservar Ahora
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
