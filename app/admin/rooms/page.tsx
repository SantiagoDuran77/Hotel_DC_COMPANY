// app/admin/rooms/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2, AlertCircle, LogOut, Shield } from "lucide-react"
import { AdminRoomsTable } from "@/components/admin/admin-rooms-table"
import { AdminRoomsFilter } from "@/components/admin/admin-rooms-filter"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getRooms, createRoom, updateRoom, deleteRoom, type Room, type DatabaseRoom, isCurrentUserAdmin } from "@/lib/api"
import { authUtils } from "@/lib/utils/authUtils"

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  // Cargar usuario y habitaciones al montar el componente
  useEffect(() => {
    const user = authUtils.getCurrentUser()
    setCurrentUser(user)
    console.log('👤 Current user in page:', user)
    console.log('🔐 Admin check result:', isCurrentUserAdmin())
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('🔄 Loading rooms from API...')
      
      const roomsData = await getRooms()
      console.log('✅ Rooms loaded:', roomsData)
      
      setRooms(roomsData)
      setFilteredRooms(roomsData)
    } catch (err) {
      console.error('❌ Error loading rooms:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las habitaciones'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRoom = async (roomData: Omit<DatabaseRoom, 'id_habitacion'>) => {
    try {
      console.log('🔄 Creating room with data:', roomData)
      
      // Verificar permisos antes de proceder
      if (!isCurrentUserAdmin()) {
        throw new Error('No tienes permisos de administrador para crear habitaciones')
      }

      const newRoom = await createRoom(roomData)
      setRooms(prev => [...prev, newRoom])
      setFilteredRooms(prev => [...prev, newRoom])
      
      toast({
        title: "Habitación creada",
        description: `La habitación ${roomData.numero_habitacion} ha sido creada exitosamente`,
      })
      
      return newRoom
    } catch (error) {
      console.error('❌ Error creating room:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la habitación'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateRoom = async (id: string, roomData: Partial<DatabaseRoom>) => {
    try {
      console.log('🔄 Updating room:', id, roomData)
      
      // Verificar permisos antes de proceder
      if (!isCurrentUserAdmin()) {
        throw new Error('No tienes permisos de administrador para actualizar habitaciones')
      }

      const updatedRoom = await updateRoom(id, roomData)
      setRooms(prev => prev.map(room => 
        room.id === id ? updatedRoom : room
      ))
      setFilteredRooms(prev => prev.map(room => 
        room.id === id ? updatedRoom : room
      ))
      
      toast({
        title: "Habitación actualizada",
        description: `La habitación ha sido actualizada exitosamente`,
      })
      
      return updatedRoom
    } catch (error) {
      console.error('❌ Error updating room:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la habitación'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      console.log('🔄 Deleting room:', id)
      
      // Verificar permisos antes de proceder
      if (!isCurrentUserAdmin()) {
        throw new Error('No tienes permisos de administrador para eliminar habitaciones')
      }

      await deleteRoom(id)
      setRooms(prev => prev.filter(room => room.id !== id))
      setFilteredRooms(prev => prev.filter(room => room.id !== id))
      
      toast({
        title: "Habitación eliminada",
        description: "La habitación ha sido eliminada exitosamente",
      })
    } catch (error) {
      console.error('❌ Error deleting room:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la habitación'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleFilter = (filters: {
    tipo?: string
    estado?: string
    numero?: string
  }) => {
    let filtered = rooms

    if (filters.tipo && filters.tipo !== 'all') {
      filtered = filtered.filter(room => room.tipo === filters.tipo)
    }

    if (filters.estado && filters.estado !== 'all') {
      filtered = filtered.filter(room => room.estado === filters.estado)
    }

    if (filters.numero) {
      filtered = filtered.filter(room => 
        room.number.toString().includes(filters.numero!)
      )
    }

    setFilteredRooms(filtered)
  }

  const isAdmin = isCurrentUserAdmin()

  const handleReLogin = () => {
    authUtils.logout()
    window.location.href = '/login'
  }

  const handleDebugAuth = () => {
    const user = authUtils.getCurrentUser()
    const token = localStorage.getItem('accessToken')
    
    console.log('🔍 Debug Auth Info:', {
      user,
      token: token ? `Present (${token.substring(0, 20)}...)` : 'Missing',
      isAdmin: isCurrentUserAdmin(),
      localStorage: {
        accessToken: localStorage.getItem('accessToken'),
        user: localStorage.getItem('user')
      }
    })

    toast({
      title: "Información de Autenticación",
      description: "Revisa la consola para ver los detalles de autenticación",
    })
  }

  if (error && !rooms.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-600 text-lg mb-4 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          Error: {error}
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button onClick={loadRooms}>
            <Loader2 className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
          <Button variant="outline" onClick={handleDebugAuth}>
            <Shield className="mr-2 h-4 w-4" />
            Debug Auth
          </Button>
          <Button variant="outline" onClick={handleReLogin}>
            <LogOut className="mr-2 h-4 w-4" />
            Volver a iniciar sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habitaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las habitaciones del hotel ({filteredRooms.length} de {rooms.length} encontradas)
          </p>
          {currentUser && (
            <div className="text-sm text-gray-500 space-y-1 mt-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>
                  Usuario: <strong>{currentUser.nombre_empleado || currentUser.nombre_cliente || currentUser.correo_usuario}</strong>
                  {currentUser.cargo_empleado && ` - ${currentUser.cargo_empleado}`}
                  {currentUser.usuario_acceso && ` (${currentUser.usuario_acceso})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Permisos: {isAdmin ? '✅ Empleado/Administrador' : '❌ Solo lectura'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDebugAuth}>
            <Shield className="mr-2 h-4 w-4" />
            Debug Auth
          </Button>
          <Button 
            onClick={() => {
              // Abrir el modal de agregar habitación desde AdminRoomsTable
              const event = new CustomEvent('openAddRoomModal')
              window.dispatchEvent(event)
            }}
            disabled={isLoading || !isAdmin}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar habitación
            {!isAdmin && " (No permitido)"}
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>No tienes permisos de empleado.</strong> Solo puedes ver las habitaciones. 
            Para realizar cambios, inicia sesión con una cuenta de empleado como:
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>carlos.ramirez@hoteldc.com (Administrador)</li>
              <li>laura.martinez@hoteldc.com (Recepcionista)</li>
              <li>sofia.moreno@hoteldc.com (Limpieza)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && (
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Tienes permisos de empleado.</strong> Puedes crear, editar y eliminar habitaciones.
          </AlertDescription>
        </Alert>
      )}

      <AdminRoomsFilter 
        onFilter={handleFilter}
        isLoading={isLoading}
      />
      
      <AdminRoomsTable 
        rooms={filteredRooms}
        isLoading={isLoading}
        onUpdateRoom={isAdmin ? handleUpdateRoom : undefined}
        onDeleteRoom={isAdmin ? handleDeleteRoom : undefined}
        onCreateRoom={isAdmin ? handleCreateRoom : undefined}
        onReload={loadRooms}
        isAdmin={isAdmin}
      />
    </div>
  )
}