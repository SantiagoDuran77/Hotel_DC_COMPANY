"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "+34 612 345 678",
    address: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    country: "España",
    preferences: {
      roomType: "suite",
      bedType: "king",
      floor: "high",
      specialRequests: "Habitación alejada del ascensor. Almohadas extra.",
    },
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...(prevData[parent as keyof typeof prevData] as Record<string, unknown>),
          [child]: value,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // En una aplicación real, aquí enviaríamos los datos a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Información personal actualizada con éxito")
    } catch (error) {
      console.error("Error al actualizar la información:", error)
      alert("Error al actualizar la información. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // En una aplicación real, aquí enviaríamos los datos a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Preferencias actualizadas con éxito")
    } catch (error) {
      console.error("Error al actualizar las preferencias:", error)
      alert("Error al actualizar las preferencias. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      // En una aplicación real, aquí enviaríamos los datos a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Limpiar los campos de contraseña
      setFormData((prevData) => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      alert("Contraseña actualizada con éxito")
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error)
      alert("Error al actualizar la contraseña. Por favor, inténtelo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="personal">Información Personal</TabsTrigger>
        <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        <TabsTrigger value="security">Seguridad</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="preferences">
        <form onSubmit={handlePreferencesSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferences.roomType">Tipo de Habitación Preferida</Label>
              <select
                id="preferences.roomType"
                name="preferences.roomType"
                value={formData.preferences.roomType}
                onChange={handleInputChange as any}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="standard">Estándar</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidencial</option>
              </select>
            </div>
            <div>
              <Label htmlFor="preferences.bedType">Tipo de Cama Preferida</Label>
              <select
                id="preferences.bedType"
                name="preferences.bedType"
                value={formData.preferences.bedType}
                onChange={handleInputChange as any}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="single">Individual</option>
                <option value="double">Doble</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="preferences.floor">Preferencia de Planta</Label>
            <select
              id="preferences.floor"
              name="preferences.floor"
              value={formData.preferences.floor}
              onChange={handleInputChange as any}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="low">Planta baja</option>
              <option value="middle">Planta media</option>
              <option value="high">Planta alta</option>
            </select>
          </div>

          <div>
            <Label htmlFor="preferences.specialRequests">Solicitudes Especiales</Label>
            <Textarea
              id="preferences.specialRequests"
              name="preferences.specialRequests"
              value={formData.preferences.specialRequests}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Preferencias"}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="security">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  )
}
