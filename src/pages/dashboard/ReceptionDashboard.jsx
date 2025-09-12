"use client"

import { useAuth } from "../../contexts/AuthContext"

const ReceptionDashboard = () => {
  const { user } = useAuth()

  const todayReservations = [
    { id: 1, guest: "María González", room: "101", checkIn: "14:00", status: "Esperando" },
    { id: 2, guest: "Carlos Rodríguez", room: "205", checkIn: "15:30", status: "Confirmado" },
    { id: 3, guest: "Ana Martínez", room: "301", checkIn: "16:00", status: "En proceso" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Panel de Recepción</h2>
        <p className="text-gray-600">Bienvenido, {user?.name}. Gestiona las llegadas y salidas del día.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold text-gray-900">Check-ins Hoy</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">🚪</div>
          <h3 className="font-semibold text-gray-900">Check-outs Hoy</h3>
          <p className="text-2xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">🏨</div>
          <h3 className="font-semibold text-gray-900">Habitaciones Disponibles</h3>
          <p className="text-2xl font-bold text-orange-600">15</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Llegadas de Hoy</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Huésped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Habitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.guest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reservation.status === "Confirmado"
                          ? "bg-green-100 text-green-800"
                          : reservation.status === "En proceso"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Check-in</button>
                    <button className="text-gray-600 hover:text-gray-900">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReceptionDashboard
