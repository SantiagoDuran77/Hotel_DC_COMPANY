"use client"

import { useAuth } from "../../contexts/AuthContext"

const CustomerDashboard = () => {
  const { user } = useAuth()

  const mockReservations = [
    {
      id: 1,
      roomType: "Suite Presidencial",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      status: "Confirmada",
    },
    {
      id: 2,
      roomType: "Habitación Deluxe",
      checkIn: "2024-03-10",
      checkOut: "2024-03-12",
      status: "Pendiente",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenido, {user?.name}</h2>
        <p className="text-gray-600">Gestiona tus reservas y perfil desde aquí.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Mis Reservas</h3>
        <div className="space-y-4">
          {mockReservations.map((reservation) => (
            <div key={reservation.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{reservation.roomType}</h4>
                  <p className="text-gray-600">
                    {reservation.checkIn} - {reservation.checkOut}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.status === "Confirmada"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {reservation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">🏨</div>
          <h3 className="font-semibold text-gray-900">Reservas Activas</h3>
          <p className="text-2xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="font-semibold text-gray-900">Puntos de Fidelidad</h3>
          <p className="text-2xl font-bold text-blue-600">1,250</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-gray-900">Estancias Totales</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
