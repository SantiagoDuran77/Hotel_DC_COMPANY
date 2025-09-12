"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bed,
  Coffee,
  LogOut,
  Settings,
  Users,
  UserCog,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="h-screen border-r bg-background">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">Hotel Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin") && "bg-muted text-primary",
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/rooms"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/rooms") && "bg-muted text-primary",
            )}
          >
            <Bed className="h-4 w-4" />
            <span>Habitaciones</span>
          </Link>
          <Link
            href="/admin/bookings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/bookings") && "bg-muted text-primary",
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Reservas</span>
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/users") && "bg-muted text-primary",
            )}
          >
            <Users className="h-4 w-4" />
            <span>Usuarios</span>
          </Link>
          <Link
            href="/admin/employees"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/employees") && "bg-muted text-primary",
            )}
          >
            <UserCog className="h-4 w-4" />
            <span>Empleados</span>
          </Link>
          <Link
            href="/admin/services"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/services") && "bg-muted text-primary",
            )}
          >
            <Coffee className="h-4 w-4" />
            <span>Servicios</span>
          </Link>
          <Link
            href="/admin/payments"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/payments") && "bg-muted text-primary",
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span>Pagos</span>
          </Link>
          <Link
            href="/admin/promotions"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/promotions") && "bg-muted text-primary",
            )}
          >
            <Tag className="h-4 w-4" />
            <span>Promociones</span>
          </Link>
          <Link
            href="/admin/messages"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/messages") && "bg-muted text-primary",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Mensajes</span>
          </Link>
          <Link
            href="/admin/notifications"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/notifications") && "bg-muted text-primary",
            )}
          >
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </Link>
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive("/admin/settings") && "bg-muted text-primary",
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          <span>Salir</span>
        </Link>
      </div>
    </div>
  )
}
