import { getRooms } from "@/lib/api"
import RoomCard from "./room-card"

export default async function FeaturedRooms() {
  const allRooms = await getRooms()
  // Obtener 3 habitaciones destacadas
  const featuredRooms = allRooms.slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}
