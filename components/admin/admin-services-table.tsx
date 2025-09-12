"use client"

import type React from "react"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Edit, MoreHorizontal, Trash2, Eye, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function AdminServicesTable() {
  const [services, setServices] = useState([
    {
      id: "s1",
      name: "Servicio de habitaciones",
      category: "Habitación",
      price: 15,
      description: "Servicio de comida y bebida a la habitación",
      isAvailable: true,
      image: "/placeholder.svg?height=50&width=50&text=Servicio",
    },
    {
      id: "s2",
      name: "Spa",
      category: "Bienestar",
      price: 80,
      description: "Acceso al spa con masajes y tratamientos",
      isAvailable: true,
      image: "/placeholder.svg?height=50&width=50&text=Spa",
    },
    {
      id: "s3",
      name: "Gimnasio",
      category: "Bienestar",
      price: 0,
      description: "Acceso al gimnasio del hotel",
      isAvailable: true,
      image: "/placeholder.svg?height=50&width=50&text=Gym",
    },
    {
      id: "s4",
      name: "Traslado al aeropuerto",
      category: "Transporte",
      price: 50,
      description: "Servicio de traslado desde/hacia el aeropuerto",
      isAvailable: true,
      image: "/placeholder.svg?height=50&width=50&text=Traslado",
    },
    {
      id: "s5",
      name: "Restaurante",
      category: "Alimentación",
      price: 0,
      description: "Restaurante del hotel con menú variado",
      isAvailable: true,
      image: "/placeholder.svg?height=50&width=50&text=Restaurante",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    isAvailable: true,
  })
  const { toast } = useToast()

  // Filtrar servicios cuando cambia el término de búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term) {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(term.toLowerCase()) ||
          service.category.toLowerCase().includes(term.toLowerCase()) ||
          service.description.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredServices(filtered)
    } else {
      setFilteredServices(services)
    }
  }

  // Función para cambiar la disponibilidad de un servicio
  const toggleAvailability = (id: string) => {
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, isAvailable: !service.isAvailable } : service,
    )
    setServices(updatedServices)
    setFilteredServices(
      searchTerm
        ? updatedServices.filter(
            (service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : updatedServices,
    )

    toast({
      title: "Estado actualizado",
      description: "La disponibilidad del servicio ha sido actualizada.",
      duration: 3000,
    })
  }

  // Función para abrir el diálogo de eliminación
  const openDeleteDialog = (service: any) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  // Función para eliminar un servicio
  const deleteService = () => {
    if (!selectedService) return

    const updatedServices = services.filter((service) => service.id !== selectedService.id)
    setServices(updatedServices)
    setFilteredServices(
      searchTerm
        ? updatedServices.filter(
            (service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : updatedServices,
    )

    setIsDeleteDialogOpen(false)

    toast({
      title: "Servicio eliminado",
      description: `El servicio ${selectedService.name} ha sido eliminado.`,
      duration: 3000,
    })
  }

  // Función para abrir el diálogo de edición
  const openEditDialog = (service: any) => {
    setSelectedService(service)
    setEditFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      isAvailable: service.isAvailable,
    })
    setIsEditDialogOpen(true)
  }

  // Función para abrir el diálogo de vista detallada
  const openViewDialog = (service: any) => {
    setSelectedService(service)
    setIsViewDialogOpen(true)
  }

  // Función para abrir el diálogo de añadir servicio
  const openAddDialog = () => {
    setEditFormData({
      name: "",
      category: "Habitación",
      price: 0,
      description: "",
      isAvailable: true,
    })
    setIsAddDialogOpen(true)
  }

  // Función para manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  // Función para guardar los cambios de edición
  const saveEditChanges = () => {
    if (!selectedService) return

    const updatedServices = services.map((service) =>
      service.id === selectedService.id
        ? {
            ...service,
            name: editFormData.name,
            category: editFormData.category,
            price: editFormData.price,
            description: editFormData.description,
            isAvailable: editFormData.isAvailable,
          }
        : service,
    )

    setServices(updatedServices)
    setFilteredServices(
      searchTerm
        ? updatedServices.filter(
            (service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : updatedServices,
    )

    setIsEditDialogOpen(false)

    toast({
      title: "Servicio actualizado",
      description: `El servicio ${editFormData.name} ha sido actualizado.`,
      duration: 3000,
    })
  }

  // Función para añadir un nuevo servicio
  const addService = () => {
    const newService = {
      id: `s${services.length + 1}`,
      name: editFormData.name,
      category: editFormData.category,
      price: editFormData.price,
      description: editFormData.description,
      isAvailable: editFormData.isAvailable,
      image: "/placeholder.svg?height=50&width=50&text=Nuevo",
    }

    const updatedServices = [...services, newService]
    setServices(updatedServices)
    setFilteredServices(
      searchTerm
        ? updatedServices.filter(
            (service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : updatedServices,
    )

    setIsAddDialogOpen(false)

    toast({
      title: "Servicio añadido",
      description: `El servicio ${editFormData.name} ha sido añadido.`,
      duration: 3000,
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="search"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Servicio
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Servicio</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Categoría</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Precio</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Descripción</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Disponibilidad</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr
                  key={service.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div className="font-medium">{service.name}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{service.category}</Badge>
                  </td>
                  <td className="p-4 align-middle">{service.price === 0 ? "Gratis" : `$${service.price}`}</td>
                  <td className="p-4 align-middle max-w-xs truncate">{service.description}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={service.isAvailable ? "outline" : "secondary"}
                      className={
                        service.isAvailable
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                      }
                    >
                      {service.isAvailable ? "Disponible" : "No disponible"}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Switch checked={service.isAvailable} onCheckedChange={() => toggleAvailability(service.id)} />
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
                        <DropdownMenuItem onClick={() => openViewDialog(service)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(service)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
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

      {/* Diálogo de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar el servicio {selectedService?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteService}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar servicio</DialogTitle>
            <DialogDescription>Modifique los detalles del servicio y guarde los cambios.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) => setEditFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Habitación">Habitación</SelectItem>
                  <SelectItem value="Bienestar">Bienestar</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Alimentación">Alimentación</SelectItem>
                  <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={editFormData.price}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">
                Disponible
              </Label>
              <div className="col-span-3">
                <Switch
                  id="isAvailable"
                  checked={editFormData.isAvailable}
                  onCheckedChange={(checked) => setEditFormData((prev) => ({ ...prev, isAvailable: checked }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditChanges}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de vista detallada */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles del servicio</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <img
                  src={selectedService.image || "/placeholder.svg"}
                  alt={selectedService.name}
                  className="h-24 w-24 rounded-md object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Nombre</h3>
                  <p>{selectedService.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Categoría</h3>
                  <Badge variant="outline">{selectedService.category}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Precio</h3>
                  <p>{selectedService.price === 0 ? "Gratis" : `$${selectedService.price}`}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Estado</h3>
                  <Badge
                    variant={selectedService.isAvailable ? "outline" : "secondary"}
                    className={selectedService.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                  >
                    {selectedService.isAvailable ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Descripción</h3>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cerrar
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                openEditDialog(selectedService)
              }}
            >
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de añadir servicio */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir nuevo servicio</DialogTitle>
            <DialogDescription>Complete los detalles del nuevo servicio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) => setEditFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Habitación">Habitación</SelectItem>
                  <SelectItem value="Bienestar">Bienestar</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Alimentación">Alimentación</SelectItem>
                  <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={editFormData.price}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">
                Disponible
              </Label>
              <div className="col-span-3">
                <Switch
                  id="isAvailable"
                  checked={editFormData.isAvailable}
                  onCheckedChange={(checked) => setEditFormData((prev) => ({ ...prev, isAvailable: checked }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addService}>Añadir servicio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
