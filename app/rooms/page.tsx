import type { Metadata } from "next"
import RoomCard from "@/components/room-card"
import { getRooms } from "@/lib/api"
import FilterSidebar from "@/components/filter-sidebar"

export const metadata: Metadata = {
  title: "Habitaciones y Suites - Hotel de Lujo",
  description: "Explore nuestra selección de habitaciones y suites de lujo para su estancia perfecta.",
}

export default async function RoomsPage() {
  const rooms = await getRooms()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Habitaciones y Suites</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <FilterSidebar />
          </div>

          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
