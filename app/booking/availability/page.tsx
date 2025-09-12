import type { Metadata } from "next"
import AvailabilityCalendar from "@/components/booking/availability-calendar"
import RoomFilters from "@/components/booking/room-filters"

export const metadata: Metadata = {
  title: "Disponibilidad de Habitaciones - Hotel de Lujo",
  description: "Consulte la disponibilidad de nuestras habitaciones y suites para sus fechas de viaje.",
}

export default function AvailabilityPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Disponibilidad de Habitaciones</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <RoomFilters />
          </div>
          <div className="lg:col-span-3">
            <AvailabilityCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
