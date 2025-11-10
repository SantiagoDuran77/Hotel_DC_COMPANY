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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, MoreHorizontal, Trash2, UserCheck, UserX, PlusCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { isCurrentUserAdmin, getUsers, updateUserStatus, deleteUser, createUser, updateUser } from "@/lib/api"

interface User {
  id: string
  email: string
  role: string
  status: string
  registration_date: string
  name: string
  last_name: string
  phone: string
  address?: string
  nationality?: string
  position?: string
}

export function AdminUsersTable() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = isCurrentUserAdmin()

  // Cargar usuarios usando la función de API
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando usuarios usando API...')
      
      const usersData = await getUsers()
      console.log(`✅ ${usersData.length} usuarios cargados`)
      setUsers(usersData)
      
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `No se pudieron cargar los usuarios: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Filtrar usuarios
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cambiar estado del usuario usando la función de API
  const handleToggleStatus = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden cambiar el estado de los usuarios",
        variant: "destructive",
      })
      return
    }

    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const newStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo'
      
      await updateUserStatus(userId, newStatus)
      await loadUsers()
      
      toast({
        title: "Estado actualizado",
        description: `El usuario ha sido ${newStatus.toLowerCase()} exitosamente`,
      })
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
      toast({
        title: "Error",
        description: "Error al actualizar el estado del usuario",
        variant: "destructive",
      })
    }

    setShowStatusDialog(false)
  }

  // Eliminar usuario usando la función de API
  const handleDeleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar usuarios",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteUser(userId)
      await loadUsers()
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error)
      toast({
        title: "Error",
        description: "Error al eliminar el usuario",
        variant: "destructive",
      })
    }

    setShowDeleteDialog(false)
  }

  // Crear usuario usando la función de API
  const handleCreateUser = async (formData: FormData) => {
    try {
      const userData = {
        email: formData.get('email') as string,
        role: formData.get('role') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        last_name: formData.get('last_name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        nationality: formData.get('nationality') as string,
        position: formData.get('position') as string,
      }

      await createUser(userData)
      await loadUsers()
      setShowCreateDialog(false)
      
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      })
    } catch (error) {
      console.error('❌ Error al crear usuario:', error)
      toast({
        title: "Error",
        description: "Error al crear el usuario",
        variant: "destructive",
      })
    }
  }

  // Actualizar usuario usando la función de API
  const handleUpdateUser = async (formData: FormData) => {
    if (!selectedUser) return

    try {
      const userData = {
        email: formData.get('email') as string,
        role: formData.get('role') as string,
        status: formData.get('status') as string,
        name: formData.get('name') as string,
        last_name: formData.get('last_name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        nationality: formData.get('nationality') as string,
        position: formData.get('position') as string,
      }

      await updateUser(selectedUser.id, userData)
      await loadUsers()
      setShowEditDialog(false)
      
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente",
      })
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error)
      toast({
        title: "Error",
        description: "Error al actualizar el usuario",
        variant: "destructive",
      })
    }
  }

  const openStatusDialog = (user: User) => {
    setSelectedUser(user)
    setShowStatusDialog(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-600 mb-4">
          <p className="font-semibold">Error al cargar usuarios</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            {users.length} usuario{users.length !== 1 ? 's' : ''} en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadUsers} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} disabled={!isAdmin}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar usuario
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Buscar usuarios por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Usuario</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Rol</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Fecha de registro</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">
                          {user.name && user.last_name 
                            ? `${user.name} ${user.last_name}`
                            : user.email
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-muted-foreground">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">
                      {user.role === "Empleado" ? "Empleado" : "Cliente"}
                      {user.position && ` - ${user.position}`}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={user.status === "Activo" ? "default" : "secondary"}
                      className={
                        user.status === "Activo"
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                      }
                    >
                      {user.status === "Activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(user.registration_date).toLocaleDateString('es-ES')}
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
                        <DropdownMenuItem onClick={() => openEditDialog(user)} disabled={!isAdmin}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStatusDialog(user)} disabled={!isAdmin}>
                          {user.status === "Activo" ? (
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
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios registrados"}
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación para cambiar estado */}
      {selectedUser && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.status === "Activo" ? "Desactivar" : "Activar"} usuario</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea {selectedUser.status === "Activo" ? "desactivar" : "activar"} al usuario{" "}
                {selectedUser.name || selectedUser.email}?
                {selectedUser.status === "Activo"
                  ? " El usuario no podrá acceder al sistema mientras esté desactivado."
                  : " El usuario podrá acceder nuevamente al sistema."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant={selectedUser.status === "Activo" ? "destructive" : "default"}
                onClick={() => handleToggleStatus(selectedUser.id)}
              >
                {selectedUser.status === "Activo" ? "Desactivar" : "Activar"}
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
                ¿Está seguro que desea eliminar al usuario {selectedUser.name || selectedUser.email}? 
                Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
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
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar usuario</DialogTitle>
              <DialogDescription>
                Modifique los datos del usuario y haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <form action={handleUpdateUser} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="edit-name"
                  name="name"
                  defaultValue={selectedUser.name}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-last_name" className="text-right text-sm font-medium">
                  Apellido
                </label>
                <input
                  id="edit-last_name"
                  name="last_name"
                  defaultValue={selectedUser.last_name}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-email" className="text-right text-sm font-medium">
                  Email
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-phone" className="text-right text-sm font-medium">
                  Teléfono
                </label>
                <input
                  id="edit-phone"
                  name="phone"
                  defaultValue={selectedUser.phone}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-role" className="text-right text-sm font-medium">
                  Rol
                </label>
                <select
                  id="edit-role"
                  name="role"
                  defaultValue={selectedUser.role}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Cliente">Cliente</option>
                  <option value="Empleado">Empleado</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right text-sm font-medium">
                  Estado
                </label>
                <select
                  id="edit-status"
                  name="status"
                  defaultValue={selectedUser.status}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              {selectedUser.role === 'Empleado' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-position" className="text-right text-sm font-medium">
                    Cargo
                  </label>
                  <select
                    id="edit-position"
                    name="position"
                    defaultValue={selectedUser.position}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Recepcionista">Recepcionista</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Limpieza">Limpieza</option>
                  </select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-address" className="text-right text-sm font-medium">
                  Dirección
                </label>
                <input
                  id="edit-address"
                  name="address"
                  defaultValue={selectedUser.address}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-nationality" className="text-right text-sm font-medium">
                  Nacionalidad
                </label>
                <input
                  id="edit-nationality"
                  name="nationality"
                  defaultValue={selectedUser.nationality}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} type="button">
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para crear usuario */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo usuario. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreateUser} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-name" className="text-right text-sm font-medium">
                Nombre *
              </label>
              <input
                id="create-name"
                name="name"
                required
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-last_name" className="text-right text-sm font-medium">
                Apellido *
              </label>
              <input
                id="create-last_name"
                name="last_name"
                required
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-email" className="text-right text-sm font-medium">
                Email *
              </label>
              <input
                id="create-email"
                name="email"
                type="email"
                required
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-password" className="text-right text-sm font-medium">
                Contraseña
              </label>
              <input
                id="create-password"
                name="password"
                type="password"
                placeholder="Opcional (por defecto: 1234)"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-phone" className="text-right text-sm font-medium">
                Teléfono
              </label>
              <input
                id="create-phone"
                name="phone"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-role" className="text-right text-sm font-medium">
                Rol *
              </label>
              <select
                id="create-role"
                name="role"
                required
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Cliente">Cliente</option>
                <option value="Empleado">Empleado</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-position" className="text-right text-sm font-medium">
                Cargo
              </label>
              <select
                id="create-position"
                name="position"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar cargo</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Administrador">Administrador</option>
                <option value="Limpieza">Limpieza</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-address" className="text-right text-sm font-medium">
                Dirección
              </label>
              <input
                id="create-address"
                name="address"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="create-nationality" className="text-right text-sm font-medium">
                Nacionalidad
              </label>
              <input
                id="create-nationality"
                name="nationality"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Crear usuario
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}