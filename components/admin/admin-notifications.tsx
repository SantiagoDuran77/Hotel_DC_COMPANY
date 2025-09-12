"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, AlertTriangle, CheckCircle, User, Bed, Calendar, DollarSign, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  category: "booking" | "room" | "payment" | "system" | "user"
}

export function AdminNotifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Habitación 205 requiere mantenimiento",
      message: "El huésped reportó problemas con el aire acondicionado",
      timestamp: "2023-06-15 14:30",
      read: false,
      category: "room",
    },
    {
      id: "2",
      type: "success",
      title: "Nueva reserva confirmada",
      message: "Reserva #B-1234 para la Suite Presidencial confirmada",
      timestamp: "2023-06-15 13:45",
      read: false,
      category: "booking",
    },
    {
      id: "3",
      type: "info",
      title: "Check-in programado",
      message: "5 huéspedes tienen check-in programado para hoy",
      timestamp: "2023-06-15 09:00",
      read: true,
      category: "booking",
    },
    {
      id: "4",
      type: "error",
      title: "Pago rechazado",
      message: "El pago de la reserva #B-1235 fue rechazado",
      timestamp: "2023-06-15 08:15",
      read: false,
      category: "payment",
    },
    {
      id: "5",
      type: "info",
      title: "Nuevo usuario registrado",
      message: "María González se registró en el sistema",
      timestamp: "2023-06-14 16:20",
      read: true,
      category: "user",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones han sido marcadas como leídas",
    })
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada",
    })
  }

  const getIcon = (type: string, category: string) => {
    if (type === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    if (type === "success") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (type === "error") return <AlertTriangle className="h-4 w-4 text-red-600" />

    switch (category) {
      case "booking":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "room":
        return <Bed className="h-4 w-4 text-purple-600" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "user":
        return <User className="h-4 w-4 text-indigo-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "secondary"
      case "success":
        return "default"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Notificaciones</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <CardDescription>Manténgase al día con las últimas actualizaciones del hotel</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type, notification.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm mt-1 ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type === "warning"
                              ? "Advertencia"
                              : notification.type === "success"
                                ? "Éxito"
                                : notification.type === "error"
                                  ? "Error"
                                  : "Info"}
                          </Badge>
                          <span className="text-xs text-gray-400">{notification.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
