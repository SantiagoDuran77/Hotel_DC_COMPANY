import type { Metadata } from "next"
import RoomSelectorCinema from "@/components/room-selector-cinema"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Seleccionar Habitación - HOTEL DC COMPANY",
  description: "Seleccione su habitación ideal para una estancia perfecta en nuestro hotel.",
}

export default function SelectRoomPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seleccionar Habitación</h1>
          <p className="text-gray-600 mt-2">Elija su habitación ideal de nuestras opciones disponibles</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <RoomSelectorCinema />
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/rooms">
            <Button variant="outline">Volver a Habitaciones</Button>
          </Link>
          <Link href="/booking">
            <Button>Continuar con la Reserva</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
