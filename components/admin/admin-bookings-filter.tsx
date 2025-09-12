"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminBookingsFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    checkIn: "",
    checkOut: "",
    roomType: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
  })
  const { toast } = useToast()

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: "Los resultados han sido filtrados según los criterios seleccionados.",
      duration: 3000,
    })
  }

  const clearFilters = () => {
    setFilters({
      checkIn: "",
      checkOut: "",
      roomType: "all",
      paymentMethod: "all",
      minAmount: "",
      maxAmount: "",
    })

    toast({
      title: "Filtros limpiados",
      description: "Todos los filtros han sido restablecidos.",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar reservas por ID, cliente o habitación..." className="w-full pl-8" />
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
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de check-in</label>
            <Input type="date" name="checkIn" value={filters.checkIn} onChange={handleFilterChange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de check-out</label>
            <Input type="date" name="checkOut" value={filters.checkOut} onChange={handleFilterChange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de habitación</label>
            <Select value={filters.roomType} onValueChange={(value) => handleSelectChange("roomType", value)}>
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
            <label className="text-sm font-medium">Método de pago</label>
            <Select value={filters.paymentMethod} onValueChange={(value) => handleSelectChange("paymentMethod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los métodos</SelectItem>
                <SelectItem value="credit">Tarjeta de crédito</SelectItem>
                <SelectItem value="debit">Tarjeta de débito</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Monto mínimo</label>
            <Input
              type="number"
              placeholder="0"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Monto máximo</label>
            <Input
              type="number"
              placeholder="5000"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-end md:col-span-3">
            <Button variant="outline" className="ml-auto" onClick={clearFilters}>
              Limpiar filtros
            </Button>
            <Button className="ml-2" onClick={applyFilters}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
