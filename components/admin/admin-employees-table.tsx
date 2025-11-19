"use client"

import { useState, useEffect } from "react"
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
import { Edit, MoreHorizontal, Trash2, Eye, Calendar, Mail, Phone } from "lucide-react"
import { getEmployees, type Employee } from "@/lib/api"

export function AdminEmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const employeesData = await getEmployees()
      setEmployees(employeesData)
    } catch (err) {
      setError('No se pudieron cargar los empleados')
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (employee: Employee) => {
    const isActive = employee.estado === 'Activo'
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive
            ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
            : "bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
        }
      >
        {isActive ? "Activo" : "Inactivo"}
      </Badge>
    )
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const handleEditEmployee = (employee: Employee) => {
    console.log('Editar empleado:', employee)
    // Aquí implementarías la lógica para editar
  }

  const handleDeleteEmployee = async (employee: Employee) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${employee.nombre} ${employee.apellido}?`)) {
      try {
        console.log('Eliminar empleado:', employee)
        // Aquí implementarías la lógica para eliminar
        // await deleteEmployee(employee.id)
        // fetchEmployees() // Recargar la lista
      } catch (error) {
        console.error('Error eliminando empleado:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando empleados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-700">{error}</p>
        <Button onClick={fetchEmployees} className="mt-4" variant="outline">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Empleado</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Cargo</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Contacto</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Fecha de contratación</th>
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
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(employee.nombre, employee.apellido)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="font-medium">
                        {employee.nombre} {employee.apellido}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="capitalize">
                    {employee.cargo}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {employee.telefono || 'No especificado'}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  {getStatusBadge(employee)}
                </td>
                <td className="p-4 align-middle">
                  {formatDate(employee.fecha_contratacion)}
                </td>
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
                      <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar empleado
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver horario
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteEmployee(employee)}
                      >
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
        
        {employees.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No se encontraron empleados
          </div>
        )}
      </div>
    </div>
  )
}