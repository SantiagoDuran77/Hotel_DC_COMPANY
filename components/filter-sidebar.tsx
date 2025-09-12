"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps {
  onFiltersChange?: (filters: any) => void
}

export default function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([100, 500])
  const [amenities, setAmenities] = useState<string[]>([])
  const [roomType, setRoomType] = useState<string[]>([])

  const amenitiesList = [
    "WiFi gratuito",
    "Aire acondicionado",
    "TV por cable",
    "Minibar",
    "Servicio a la habitación",
    "Balcón",
    "Vista al mar",
    "Jacuzzi",
  ]

  const roomTypes = ["Habitación estándar", "Habitación deluxe", "Suite junior", "Suite presidencial"]

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  const handleRoomTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setRoomType([...roomType, type])
    } else {
      setRoomType(roomType.filter((t) => t !== type))
    }
  }

  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      amenities,
      roomType,
    }
    onFiltersChange?.(filters)
  }

  const handleClearFilters = () => {
    setPriceRange([100, 500])
    setAmenities([])
    setRoomType([])
    onFiltersChange?.({
      priceRange: [100, 500],
      amenities: [],
      roomType: [],
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>

      {/* Rango de precios */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">
          Precio por noche: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider value={priceRange} onValueChange={setPriceRange} max={1000} min={50} step={25} className="w-full" />
      </div>

      {/* Tipo de habitación */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">Tipo de habitación</Label>
        <div className="space-y-2">
          {roomTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={roomType.includes(type)}
                onCheckedChange={(checked) => handleRoomTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={type} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Comodidades */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">Comodidades</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity} className="text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Aplicar filtros
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="w-full bg-transparent">
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
