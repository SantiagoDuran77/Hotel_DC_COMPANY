"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardHeader() {
  const pathname = usePathname()

  // Datos de usuario simulados
  const user = {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  return (
    <header className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-primary">
            <Home className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Panel de Usuario - HOTEL DC COMPANY</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Panel Principal</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/reservations">Mis Reservas</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Mi Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex mt-4 border-b">
        <Link
          href="/dashboard"
          className={`px-4 py-2 text-sm font-medium ${
            pathname === "/dashboard" ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-primary"
          }`}
        >
          Panel Principal
        </Link>
        <Link
          href="/dashboard/reservations"
          className={`px-4 py-2 text-sm font-medium ${
            pathname === "/dashboard/reservations"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-primary"
          }`}
        >
          Mis Reservas
        </Link>
        <Link
          href="/dashboard/profile"
          className={`px-4 py-2 text-sm font-medium ${
            pathname === "/dashboard/profile"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-primary"
          }`}
        >
          Mi Perfil
        </Link>
      </nav>
    </header>
  )
}
