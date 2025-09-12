"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users } from "lucide-react"

export default function SearchBar() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de búsqueda
    console.log({ checkIn, checkOut, guests, location })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkin" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Check-in
          </Label>
          <Input id="checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Check-out
          </Label>
          <Input id="checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Huéspedes
          </Label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1">1 Huésped</option>
            <option value="2">2 Huéspedes</option>
            <option value="3">3 Huéspedes</option>
            <option value="4">4 Huéspedes</option>
            <option value="5">5+ Huéspedes</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Ubicación
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Ciudad o región"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="md:col-span-4 flex justify-center">
          <Button type="submit" size="lg" className="px-8">
            Buscar Habitaciones
          </Button>
        </div>
      </form>
    </div>
  )
}
