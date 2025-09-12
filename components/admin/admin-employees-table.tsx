"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Eye, Calendar } from "lucide-react"

export function AdminEmployeesTable() {
  const employees = [
    {
      id: "e1",
      name: "Javier Méndez",
      email: "javier@hotel.com",
      position: "Recepcionista",
      department: "Recepción",
      status: "active",
      joinDate: "2022-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "e2",
      name: "Lucía Fernández",
      email: "lucia@hotel.com",
      position: "Gerente",
      department: "Administración",
      status: "active",
      joinDate: "2020-05-10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "e3",
      name: "Miguel Torres",
      email: "miguel@hotel.com",
      position: "Chef",
      department: "Cocina",
      status: "active",
      joinDate: "2021-03-22",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "e4",
      name: "Carmen Ruiz",
      email: "carmen@hotel.com",
      position: "Camarera",
      department: "Limpieza",
      status: "inactive",
      joinDate: "2022-02-01",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "e5",
      name: "Pablo Soto",
      email: "pablo@hotel.com",
      position: "Mantenimiento",
      department: "Mantenimiento",
      status: "active",
      joinDate: "2021-11-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Empleado</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Posición</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Departamento</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Fecha de ingreso</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">{employee.position}</td>
                <td className="p-4 align-middle">{employee.department}</td>
                <td className="p-4 align-middle">
                  <Badge
                    variant={employee.status === "active" ? "default" : "secondary"}
                    className={
                      employee.status === "active"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                    }
                  >
                    {employee.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="p-4 align-middle">{employee.joinDate}</td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar empleado
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver horario
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar empleado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
