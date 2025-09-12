"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Datos de reserva simulados
const mockReservations = [
  {
    id: "res-002",
    roomId: "premium-double",
    roomName: "Habitación Premium Doble",
    checkIn: "2024-01-10",
    checkOut: "2024-01-15",
    guests: 3,
    status: "confirmed",
    totalPrice: 1245,
    isPaid: false,
  },
  {
    id: "res-004",
    roomId: "family-suite",
    roomName: "Suite Familiar",
    checkIn: "2024-02-20",
    checkOut: "2024-02-25",
    guests: 4,
    status: "confirmed",
    totalPrice: 1995,
    isPaid: false,
  },
]

interface PaymentFormProps {
  reservationId: string
}

export default function PaymentForm({ reservationId }: PaymentFormProps) {
  const router = useRouter()
  const [reservation, setReservation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  useEffect(() => {
    // En una aplicación real, obtendríamos los datos de la API
    const res = mockReservations.find((r) => r.id === reservationId)
    if (res) {
      setReservation(res)
    }
  }, [reservationId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // En una aplicación real, aquí procesaríamos el pago a través de la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPaymentComplete(true)
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      alert("Error al procesar el pago. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!reservation) {
    return (
      <div className="text-center py-8">
        <p>Cargando detalles de la reserva...</p>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Pago Completado!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Su pago ha sido procesado con éxito. Hemos enviado un recibo a su correo electrónico.
        </p>
        <div className="pt-4">
          <Button onClick={() => router.push("/dashboard/reservations")}>Ver Mis Reservas</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Resumen de la Reserva</h3>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-gray-600">Habitación:</div>
          <div>{reservation.roomName}</div>
          <div className="text-gray-600">Importe Total:</div>
          <div className="font-bold">${reservation.totalPrice}</div>
          <div className="text-gray-600">Estado:</div>
          <div>{reservation.status === "confirmed" ? "Confirmada" : reservation.status}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
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
          </RadioGroup>
        </div>

        {paymentMethod === "credit-card" && (
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
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="mb-4">Será redirigido a PayPal para completar el pago.</p>
            <p className="text-sm text-gray-600">
              Asegúrese de tener su cuenta de PayPal lista para el proceso de pago.
            </p>
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total a Pagar:</span>
            <span className="text-2xl font-bold">${reservation.totalPrice}</span>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Procesando Pago..." : "Completar Pago"}
          </Button>
        </div>
      </form>
    </div>
  )
}
