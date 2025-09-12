import type { Habitacion, DetallesHabitacion } from "../types"

export class HabitacionModel implements Habitacion {
  id_habitacion: number
  numero_habitacion: number
  tipo_habitacion: string
  estado_habitacion: "disponible" | "ocupada" | "mantenimiento" | "limpieza"
  precio_noche: number
  capacidad_maxima: number

  constructor(data: Partial<Habitacion>) {
    this.id_habitacion = data.id_habitacion || 0
    this.numero_habitacion = data.numero_habitacion || 0
    this.tipo_habitacion = data.tipo_habitacion || ""
    this.estado_habitacion = data.estado_habitacion || "disponible"
    this.precio_noche = data.precio_noche || 0
    this.capacidad_maxima = data.capacidad_maxima || 1
  }

  verificar_disponibilidad(): boolean {
    return this.estado_habitacion === "disponible"
  }

  cambiar_estado(): void {
    console.log(`Cambiando estado de habitación ${this.numero_habitacion}`)
  }

  actualizar_precio(): void {
    console.log(`Actualizando precio de habitación ${this.numero_habitacion}`)
  }

  validar_ocupacion(): boolean {
    return this.estado_habitacion === "ocupada"
  }

  programar_mantenimiento(): void {
    this.estado_habitacion = "mantenimiento"
    console.log(`Programando mantenimiento para habitación ${this.numero_habitacion}`)
  }
}

export class DetallesHabitacionModel implements DetallesHabitacion {
  id_detalles: number
  descripcion: string
  comodidades: string
  precio_adicional: number
  capacidad: number
  tipo_cama: string

  constructor(data: Partial<DetallesHabitacion>) {
    this.id_detalles = data.id_detalles || 0
    this.descripcion = data.descripcion || ""
    this.comodidades = data.comodidades || ""
    this.precio_adicional = data.precio_adicional || 0
    this.capacidad = data.capacidad || 1
    this.tipo_cama = data.tipo_cama || ""
  }

  actualizar_detalles(): void {
    console.log(`Actualizando detalles de habitación ${this.id_detalles}`)
  }

  validar_capacidad(): boolean {
    return this.capacidad > 0
  }

  obtener_comodidades(): void {
    console.log(`Obteniendo comodidades: ${this.comodidades}`)
  }

  actualizar_precio(): void {
    console.log(`Actualizando precio adicional: ${this.precio_adicional}`)
  }

  validar_comodidad(): boolean {
    return this.comodidades.length > 0
  }
}
