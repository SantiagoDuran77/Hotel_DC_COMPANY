import type { Metadata } from "next"
import PaymentForm from "@/components/dashboard/payment-form"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "Pago de Reserva - Hotel de Lujo",
  description: "Complete el pago de su reserva de forma segura.",
}

export default async function PaymentPage({ params }: { params: { id: string } }) {
  // En una aplicación real, obtendríamos los detalles de la reserva desde la API
  const reservationId = params.id

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pago de Reserva</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <PaymentForm reservationId={reservationId} />
          </div>
        </div>
      </div>
    </div>
  )
}
