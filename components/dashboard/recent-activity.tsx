"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CreditCard, Calendar, Check, X } from "lucide-react"

// Datos de actividad simulados
const recentActivities = [
  {
    id: "act-001",
    type: "payment",
    description: "Pago realizado para la reserva res-001",
    amount: 995,
    date: "2023-11-05T14:30:00Z",
  },
  {
    id: "act-002",
    type: "booking",
    description: "Nueva reserva creada: Suite Presidencial",
    reservationId: "res-007",
    date: "2023-11-30T13:45:00Z",
  },
  {
    id: "act-003",
    type: "check-in",
    description: "Check-in completado para la reserva res-003",
    reservationId: "res-003",
    date: "2023-10-05T15:00:00Z",
  },
  {
    id: "act-004",
    type: "check-out",
    description: "Check-out completado para la reserva res-003",
    reservationId: "res-003",
    date: "2023-10-08T11:30:00Z",
  },
  {
    id: "act-005",
    type: "booking",
    description: "Nueva reserva creada: Habitación Premium Doble",
    reservationId: "res-002",
    date: "2023-11-15T14:45:00Z",
  },
]

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-5 w-5 text-green-500" />
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "check-in":
        return <Check className="h-5 w-5 text-green-500" />
      case "check-out":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {recentActivities.slice(0, 5).map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
          <div>
            <p className="text-sm text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500">{format(new Date(activity.date), "PPp", { locale: es })}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
