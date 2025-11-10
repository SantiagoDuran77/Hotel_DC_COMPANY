"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export interface BookingFilters {
  search: string
  status: string
  checkIn: string
  checkOut: string
  roomType: string
  minAmount: string
  maxAmount: string
}

interface AdminBookingsFilterProps {
  onFilterChange?: (filters: BookingFilters) => void
}

export function AdminBookingsFilter({ onFilterChange }: AdminBookingsFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<BookingFilters>({
    search: "",
    status: "all",
    checkIn: "",
    checkOut: "",
    roomType: "all",
    minAmount: "",
    maxAmount: "",
  })
  
  const { toast } = useToast()

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSelectChange = (name: keyof BookingFilters, value: string) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const applyFilters = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => {
      if (key === 'status' || key === 'roomType') return value !== 'all'
      return value !== ''
    }).length

    toast({
      title: "Filtros aplicados",
      description: `Se aplicaron ${activeFilters} filtro${activeFilters !== 1 ? 's' : ''}`,
      duration: 3000,
    })
    
    onFilterChange?.(filters)
    setIsFilterOpen(false)
  }

  const clearFilters = () => {
    const clearedFilters: BookingFilters = {
      search: "",
      status: "all",
      checkIn: "",
      checkOut: "",
      roomType: "all",
      minAmount: "",
      maxAmount: "",
    }
    
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)

    toast({
      title: "Filtros limpiados",
      description: "Todos los filtros han sido restablecidos.",
      duration: 3000,
    })
  }

  const getActiveFilterCount = (): number => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'status' || key === 'roomType') return value !== 'all'
      return value !== ''
    }).length
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar por ID, nombre de cliente, email o habitación..." 
            className="w-full pl-8 pr-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Confirmada">Confirmada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-1 h-3 w-3" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filtros avanzados</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="checkIn" className="text-sm font-medium">
                Fecha de check-in
              </label>
              <Input 
                id="checkIn"
                type="date" 
                name="checkIn" 
                value={filters.checkIn} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="checkOut" className="text-sm font-medium">
                Fecha de check-out
              </label>
              <Input 
                id="checkOut"
                type="date" 
                name="checkOut" 
                value={filters.checkOut} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="roomType" className="text-sm font-medium">
                Tipo de habitación
              </label>
              <Select 
                value={filters.roomType} 
                onValueChange={(value) => handleSelectChange("roomType", value)}
              >
                <SelectTrigger id="roomType">
                  <SelectValue placeholder="Seleccionar tipo" />
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
              <label htmlFor="minAmount" className="text-sm font-medium">
                Monto mínimo
              </label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxAmount" className="text-sm font-medium">
                Monto máximo
              </label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="5000000"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeFilterCount > 0 ? (
                <span>{activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} activo{activeFilterCount !== 1 ? 's' : ''}</span>
              ) : (
                <span>Sin filtros activos</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Limpiar todo
              </Button>
              <Button onClick={applyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar filtros activos */}
      {activeFilterCount > 0 && !isFilterOpen && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Búsqueda: "{filters.search}"</span>
              <button
                onClick={() => handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.status !== "all" && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Estado: {filters.status}</span>
              <button
                onClick={() => handleSelectChange("status", "all")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.checkIn && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Check-in: {filters.checkIn}</span>
              <button
                onClick={() => handleFilterChange({ target: { name: "checkIn", value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.checkOut && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Check-out: {filters.checkOut}</span>
              <button
                onClick={() => handleFilterChange({ target: { name: "checkOut", value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.roomType !== "all" && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Habitación: {filters.roomType}</span>
              <button
                onClick={() => handleSelectChange("roomType", "all")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.minAmount && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Mín: ${parseInt(filters.minAmount).toLocaleString()}</span>
              <button
                onClick={() => handleFilterChange({ target: { name: "minAmount", value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.maxAmount && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              <span>Máx: ${parseInt(filters.maxAmount).toLocaleString()}</span>
              <button
                onClick={() => handleFilterChange({ target: { name: "maxAmount", value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}