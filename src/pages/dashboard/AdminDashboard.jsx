"use client"

import { useAuth } from "../../contexts/AuthContext"

const AdminDashboard = () => {
  const { user } = useAuth()

  const stats = [
    { name: "Habitaciones Ocupadas", value: "85%", icon: "🏨" },
    { name: "Ingresos del Mes", value: "$125,000", icon: "💰" },
    { name: "Huéspedes Activos", value: "156", icon: "👥" },
    { name: "Satisfacción", value: "4.8/5", icon: "⭐" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Panel de Administración</h2>
        <p className="text-gray-600">Bienvenido, {user?.name}. Aquí tienes un resumen del hotel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="font-semibold text-gray-900">{stat.name}</h3>
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Reservas Recientes</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Reserva #{item}001</p>
                  <p className="text-sm text-gray-600">Suite Presidencial</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Confirmada</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
          <div className="space-y-3">
            {["Revisar inventario", "Aprobar solicitudes", "Actualizar precios"].map((task, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                <input type="checkbox" className="mr-3" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
