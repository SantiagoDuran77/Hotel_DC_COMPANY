"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RoomFilters() {
  const [priceRange, setPriceRange] = useState([100, 600])
  const [filters, setFilters] = useState({
    amenities: {
      wifi: true,
      breakfast: false,
      parking: false,
      pool: true,
      spa: false,
      gym: false,
      airConditioning: true,
      minibar: false,
    },
    roomType: {
      standard: true,
      deluxe: true,
      suite: true,
      family: false,
      presidential: false,
    },
    bedType: {
      single: false,
      double: true,
      queen: true,
      king: true,
      twin: false,
    },
    view: {
      city: true,
      garden: true,
      pool: false,
      ocean: false,
    },
  })

  const handleAmenityChange = (amenity: keyof typeof filters.amenities) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: !filters.amenities[amenity],
      },
    })
  }

  const handleRoomTypeChange = (roomType: keyof typeof filters.roomType) => {
    setFilters({
      ...filters,
      roomType: {
        ...filters.roomType,
        [roomType]: !filters.roomType[roomType],
      },
    })
  }

  const handleBedTypeChange = (bedType: keyof typeof filters.bedType) => {
    setFilters({
      ...filters,
      bedType: {
        ...filters.bedType,
        [bedType]: !filters.bedType[bedType],
      },
    })
  }

  const handleViewChange = (view: keyof typeof filters.view) => {
    setFilters({
      ...filters,
      view: {
        ...filters.view,
        [view]: !filters.view[view],
      },
    })
  }

  const resetFilters = () => {
    setPriceRange([100, 600])
    setFilters({
      amenities: {
        wifi: true,
        breakfast: false,
        parking: false,
        pool: false,
        spa: false,
        gym: false,
        airConditioning: true,
        minibar: false,
      },
      roomType: {
        standard: true,
        deluxe: true,
        suite: true,
        family: false,
        presidential: false,
      },
      bedType: {
        single: false,
        double: true,
        queen: true,
        king: true,
        twin: false,
      },
      view: {
        city: true,
        garden: true,
        pool: false,
        ocean: false,
      },
    })
  }

  const applyFilters = () => {
    // En una aplicación real, aquí enviaríamos los filtros a la API
    console.log("Aplicando filtros:", { priceRange, filters })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Rango de Precio</h3>
          <Slider
            defaultValue={priceRange}
            min={50}
            max={1000}
            step={10}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Tipo de Habitación</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomType-standard"
                checked={filters.roomType.standard}
                onCheckedChange={() => handleRoomTypeChange("standard")}
              />
              <Label htmlFor="roomType-standard">Estándar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomType-deluxe"
                checked={filters.roomType.deluxe}
                onCheckedChange={() => handleRoomTypeChange("deluxe")}
              />
              <Label htmlFor="roomType-deluxe">Deluxe</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomType-suite"
                checked={filters.roomType.suite}
                onCheckedChange={() => handleRoomTypeChange("suite")}
              />
              <Label htmlFor="roomType-suite">Suite</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomType-family"
                checked={filters.roomType.family}
                onCheckedChange={() => handleRoomTypeChange("family")}
              />
              <Label htmlFor="roomType-family">Familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roomType-presidential"
                checked={filters.roomType.presidential}
                onCheckedChange={() => handleRoomTypeChange("presidential")}
              />
              <Label htmlFor="roomType-presidential">Presidencial</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Tipo de Cama</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bedType-single"
                checked={filters.bedType.single}
                onCheckedChange={() => handleBedTypeChange("single")}
              />
              <Label htmlFor="bedType-single">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bedType-double"
                checked={filters.bedType.double}
                onCheckedChange={() => handleBedTypeChange("double")}
              />
              <Label htmlFor="bedType-double">Doble</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bedType-queen"
                checked={filters.bedType.queen}
                onCheckedChange={() => handleBedTypeChange("queen")}
              />
              <Label htmlFor="bedType-queen">Queen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bedType-king"
                checked={filters.bedType.king}
                onCheckedChange={() => handleBedTypeChange("king")}
              />
              <Label htmlFor="bedType-king">King</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bedType-twin"
                checked={filters.bedType.twin}
                onCheckedChange={() => handleBedTypeChange("twin")}
              />
              <Label htmlFor="bedType-twin">Twin</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Comodidades</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-wifi"
                checked={filters.amenities.wifi}
                onCheckedChange={() => handleAmenityChange("wifi")}
              />
              <Label htmlFor="amenity-wifi">Wi-Fi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-breakfast"
                checked={filters.amenities.breakfast}
                onCheckedChange={() => handleAmenityChange("breakfast")}
              />
              <Label htmlFor="amenity-breakfast">Desayuno</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-parking"
                checked={filters.amenities.parking}
                onCheckedChange={() => handleAmenityChange("parking")}
              />
              <Label htmlFor="amenity-parking">Parking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-pool"
                checked={filters.amenities.pool}
                onCheckedChange={() => handleAmenityChange("pool")}
              />
              <Label htmlFor="amenity-pool">Piscina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-spa"
                checked={filters.amenities.spa}
                onCheckedChange={() => handleAmenityChange("spa")}
              />
              <Label htmlFor="amenity-spa">Spa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-gym"
                checked={filters.amenities.gym}
                onCheckedChange={() => handleAmenityChange("gym")}
              />
              <Label htmlFor="amenity-gym">Gimnasio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-airConditioning"
                checked={filters.amenities.airConditioning}
                onCheckedChange={() => handleAmenityChange("airConditioning")}
              />
              <Label htmlFor="amenity-airConditioning">A/C</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenity-minibar"
                checked={filters.amenities.minibar}
                onCheckedChange={() => handleAmenityChange("minibar")}
              />
              <Label htmlFor="amenity-minibar">Minibar</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Vista</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="view-city" checked={filters.view.city} onCheckedChange={() => handleViewChange("city")} />
              <Label htmlFor="view-city">Ciudad</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="view-garden"
                checked={filters.view.garden}
                onCheckedChange={() => handleViewChange("garden")}
              />
              <Label htmlFor="view-garden">Jardín</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="view-pool" checked={filters.view.pool} onCheckedChange={() => handleViewChange("pool")} />
              <Label htmlFor="view-pool">Piscina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="view-ocean"
                checked={filters.view.ocean}
                onCheckedChange={() => handleViewChange("ocean")}
              />
              <Label htmlFor="view-ocean">Mar</Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={applyFilters}>Aplicar Filtros</Button>
          <Button variant="outline" onClick={resetFilters}>
            Restablecer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
