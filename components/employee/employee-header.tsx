"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, LogOut, Settings, User, Menu, X } from "lucide-react"
import * as authUtils from "@/lib/auth"

interface EmployeeHeaderProps {
  user: authUtils.User
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export function EmployeeHeader({ user, onMenuToggle, isMenuOpen }: EmployeeHeaderProps) {
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, message: "Nuevo servicio de masaje programado", time: "5 min" },
    { id: 2, message: "Cliente solicita cambio de horario", time: "15 min" },
    { id: 3, message: "Recordatorio: Reunión de equipo a las 3 PM", time: "1 hora" },
  ])

  const handleLogout = () => {
    authUtils.logout()
    router.push("/")
  }

  const getDepartmentColor = (department: string) => {
    switch (department?.toLowerCase()) {
      case "spa":
        return "bg-green-100 text-green-800"
      case "restaurante":
        return "bg-orange-100 text-orange-800"
      case "transporte":
        return "bg-blue-100 text-blue-800"
      case "housekeeping":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onMenuToggle} className="lg:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-gray-900">Panel de Empleado</h1>
            <p className="text-sm text-gray-500">Gestiona tus servicios y horarios</p>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-2">Notificaciones</h3>
                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-2 hover:bg-gray-50 rounded-md">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">Hace {notification.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay notificaciones</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge className={`text-xs w-fit ${getDepartmentColor(user.department || "")}`}>
                    {user.department} - {user.position}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
