import type { Metadata } from "next"
import RoomComparison from "@/components/booking/room-comparison"

export const metadata: Metadata = {
  title: "Comparar Habitaciones - Hotel de Lujo",
  description: "Compare nuestras diferentes habitaciones y suites para encontrar la opción perfecta para su estancia.",
}

export default function CompareRoomsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Comparar Habitaciones</h1>
        <RoomComparison />
      </div>
    </div>
  )
}
