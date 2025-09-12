"use client"

import { useAuth } from "../../contexts/AuthContext"

const EmployeeDashboard = () => {
  const { user } = useAuth()

  const tasks = [
    { id: 1, task: "Limpieza habitación 205", priority: "Alta", time: "10:00 AM" },
    { id: 2, task: "Servicio a la habitación 301", priority: "Media", time: "11:30 AM" },
    { id: 3, task: "Mantenimiento aire acondicionado", priority: "Baja", time: "2:00 PM" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Panel de Empleado</h2>
        <p className="text-gray-600">Bienvenido, {user?.name}. Aquí están tus tareas del día.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-semibold text-gray-900">Tareas Completadas</h3>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <h3 className="font-semibold text-gray-900">Tareas Pendientes</h3>
          <p className="text-2xl font-bold text-orange-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-gray-900">Eficiencia</h3>
          <p className="text-2xl font-bold text-blue-600">92%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tareas de Hoy</h3>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input type="checkbox" className="mr-4" />
                <div>
                  <p className="font-medium text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.time}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === "Alta"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "Media"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
