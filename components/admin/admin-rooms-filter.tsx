// components/admin/admin-rooms-filter.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface AdminRoomsFilterProps {
  onFilter: (filters: {
    tipo?: string
    estado?: string
    numero?: string
  }) => void
  isLoading?: boolean
}

export function AdminRoomsFilter({ onFilter, isLoading = false }: AdminRoomsFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    tipo: "",
    estado: "",
    numero: ""
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      tipo: "",
      estado: "",
      numero: ""
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  const hasActiveFilters = filters.tipo || filters.estado || filters.numero

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar por número de habitación..." 
            className="w-full pl-8"
            value={filters.numero}
            onChange={(e) => handleFilterChange('numero', e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            disabled={isLoading}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
          
          <Select 
            value={filters.estado} 
            onValueChange={(value) => handleFilterChange('estado', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="Ocupada">Ocupada</SelectItem>
              <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleClearFilters} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de habitación</label>
            <Select 
              value={filters.tipo} 
              onValueChange={(value) => handleFilterChange('tipo', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Sencilla">Sencilla</SelectItem>
                <SelectItem value="Doble">Doble</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio mínimo</label>
            <Input 
              type="number" 
              placeholder="0" 
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio máximo</label>
            <Input 
              type="number" 
              placeholder="1000000" 
              disabled={isLoading}
            />
          </div>

          <div className="flex items-end md:col-span-3">
            <Button variant="outline" className="ml-auto" onClick={handleClearFilters} disabled={isLoading}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}