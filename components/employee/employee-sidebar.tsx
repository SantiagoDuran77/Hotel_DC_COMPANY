"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Calendar,
  Users,
  Star,
  BarChart3,
  MessageSquare,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react"
import type * as authUtils from "@/lib/auth"

interface EmployeeSidebarProps {
  user: authUtils.User
  isOpen?: boolean
  onToggle?: () => void
}

export function EmployeeSidebar({ user, isOpen = true, onToggle }: EmployeeSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/employee",
      icon: Home,
      current: pathname === "/employee",
    },
    {
      name: "Mis Servicios",
      href: "/employee/services",
      icon: Briefcase,
      current: pathname === "/employee/services",
      badge: "3",
    },
    {
      name: "Horario",
      href: "/employee/schedule",
      icon: Calendar,
      current: pathname === "/employee/schedule",
    },
    {
      name: "Clientes",
      href: "/employee/clients",
      icon: Users,
      current: pathname === "/employee/clients",
    },
    {
      name: "Reseñas",
      href: "/employee/reviews",
      icon: Star,
      current: pathname === "/employee/reviews",
      badge: "2",
    },
    {
      name: "Rendimiento",
      href: "/employee/performance",
      icon: BarChart3,
      current: pathname === "/employee/performance",
    },
    {
      name: "Mensajes",
      href: "/employee/messages",
      icon: MessageSquare,
      current: pathname === "/employee/messages",
      badge: "5",
    },
    {
      name: "Historial",
      href: "/employee/history",
      icon: History,
      current: pathname === "/employee/history",
    },
  ]

  const getDepartmentColor = (department: string) => {
    switch (department?.toLowerCase()) {
      case "spa":
        return "border-green-200 bg-green-50"
      case "restaurante":
        return "border-orange-200 bg-orange-50"
      case "transporte":
        return "border-blue-200 bg-blue-50"
      case "housekeeping":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  getDepartmentColor(user.department || ""),
                )}
              >
                <span className="text-lg font-bold">{user.department?.charAt(0) || "E"}</span>
              </div>
              <div className="hidden sm:block">
                <h2 className="text-sm font-semibold text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.position}</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "px-2" : "px-3",
                    item.current && "bg-primary text-primary-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/employee/settings">
            <Button variant="ghost" className={cn("w-full justify-start", isCollapsed ? "px-2" : "px-3")}>
              <Settings className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && "Configuración"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
