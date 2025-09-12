"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, MoreHorizontal, Trash2, Eye, Lock, UserCheck, UserX } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import * as authUtils from "@/lib/auth"

export function AdminUsersTable() {
  const { toast } = useToast()
  const [usersList, setUsersList] = useState([
    {
      id: "admin1",
      name: "Administrador",
      email: "admin@hotel.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-05-17 08:20",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "staff1",
      name: "Empleado",
      email: "empleado@hotel.com",
      role: "staff",
      status: "active",
      lastLogin: "2023-05-17 11:10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "customer1",
      name: "Cliente",
      email: "cliente@ejemplo.com",
      role: "customer",
      status: "active",
      lastLogin: "2023-05-16 14:45",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u2",
      name: "María López",
      email: "maria@example.com",
      role: "customer",
      status: "active",
      lastLogin: "2023-05-16 14:45",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "u3",
      name: "Juan Pérez",
      email: "juan@example.com",
      role: "customer",
      status: "inactive",
      lastLogin: "2023-04-30 09:15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const currentUser = authUtils.getCurrentUser()
  const isAdmin = authUtils.isAdmin(currentUser)

  const handleToggleStatus = (userId) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar el estado de los usuarios",
        variant: "destructive",
      })
      return
    }

    setUsersList(
      usersList.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === "active" ? "inactive" : "active",
          }
        }
        return user
      }),
    )

    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido actualizado correctamente",
    })

    setShowStatusDialog(false)
  }

  const handleDeleteUser = (userId) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar usuarios",
        variant: "destructive",
      })
      return
    }

    setUsersList(usersList.filter((user) => user.id !== userId))

    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
    })

    setShowDeleteDialog(false)
  }

  const openStatusDialog = (user) => {
    setSelectedUser(user)
    setShowStatusDialog(true)
  }

  const openDeleteDialog = (user) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const openEditDialog = (user) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Usuario</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Rol</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Último acceso</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">
                      {user.role === "admin" ? "Administrador" : user.role === "staff" ? "Personal" : "Cliente"}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={
                        user.status === "active"
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                      }
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{user.lastLogin}</td>
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
                        <DropdownMenuItem onClick={() => openEditDialog(user)} disabled={!isAdmin}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={!isAdmin}>
                          <Lock className="mr-2 h-4 w-4" />
                          Cambiar contraseña
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStatusDialog(user)} disabled={!isAdmin}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Desactivar usuario
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activar usuario
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(user)}
                          disabled={!isAdmin}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar usuario
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

      {/* Diálogo de confirmación para cambiar estado */}
      {selectedUser && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.status === "active" ? "Desactivar" : "Activar"} usuario</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea {selectedUser.status === "active" ? "desactivar" : "activar"} al usuario{" "}
                {selectedUser.name}?
                {selectedUser.status === "active"
                  ? " El usuario no podrá acceder al sistema mientras esté desactivado."
                  : " El usuario podrá acceder nuevamente al sistema."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant={selectedUser.status === "active" ? "destructive" : "default"}
                onClick={() => handleToggleStatus(selectedUser.id)}
              >
                {selectedUser.status === "active" ? "Desactivar" : "Activar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de confirmación para eliminar */}
      {selectedUser && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar usuario</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar al usuario {selectedUser.name}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteUser(selectedUser.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para editar usuario */}
      {selectedUser && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar usuario</DialogTitle>
              <DialogDescription>
                Modifique los datos del usuario y haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="name"
                  defaultValue={selectedUser.name}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  defaultValue={selectedUser.email}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right text-sm font-medium">
                  Rol
                </label>
                <select
                  id="role"
                  defaultValue={selectedUser.role}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="admin">Administrador</option>
                  <option value="staff">Personal</option>
                  <option value="customer">Cliente</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Usuario actualizado",
                    description: "Los datos del usuario han sido actualizados correctamente",
                  })
                  setShowEditDialog(false)
                }}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
