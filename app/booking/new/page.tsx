import type { Metadata } from "next"
import AdvancedBookingForm from "@/components/booking/advanced-booking-form"

export const metadata: Metadata = {
  title: "Nueva Reserva - Hotel de Lujo",
  description: "Reserve su estancia perfecta con todas las opciones personalizadas.",
}

export default function NewBookingPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nueva Reserva</h1>
        <AdvancedBookingForm />
      </div>
    </div>
  )
}
