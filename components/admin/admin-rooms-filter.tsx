"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export function AdminRoomsFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar habitaciones..." className="w-full pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="occupied">Ocupada</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
              <SelectItem value="cleaning">Limpieza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de habitación</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="standard">Estándar</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Piso</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar piso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pisos</SelectItem>
                <SelectItem value="1">Piso 1</SelectItem>
                <SelectItem value="2">Piso 2</SelectItem>
                <SelectItem value="3">Piso 3</SelectItem>
                <SelectItem value="4">Piso 4</SelectItem>
                <SelectItem value="5">Piso 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Capacidad</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar capacidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las capacidades</SelectItem>
                <SelectItem value="1">1 persona</SelectItem>
                <SelectItem value="2">2 personas</SelectItem>
                <SelectItem value="3">3 personas</SelectItem>
                <SelectItem value="4">4+ personas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vista</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las vistas</SelectItem>
                <SelectItem value="city">Ciudad</SelectItem>
                <SelectItem value="garden">Jardín</SelectItem>
                <SelectItem value="pool">Piscina</SelectItem>
                <SelectItem value="sea">Mar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio mínimo</label>
            <Input type="number" placeholder="0" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio máximo</label>
            <Input type="number" placeholder="1000" />
          </div>

          <div className="flex items-end md:col-span-3">
            <Button variant="outline" className="ml-auto">
              Limpiar filtros
            </Button>
            <Button className="ml-2">Aplicar filtros</Button>
          </div>
        </div>
      )}
    </div>
  )
}
