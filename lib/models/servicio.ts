import type { Servicio, ServicioReserva } from "../types"

export class ServicioModel implements Servicio {
  id_servicio: number
  nombre_servicio: string
  descripcion_servicio: string
  precio_servicio: number
  categoria: string
  disponible: boolean
  duracion: number

  constructor(data: Partial<Servicio>) {
    this.id_servicio = data.id_servicio || 0
    this.nombre_servicio = data.nombre_servicio || ""
    this.descripcion_servicio = data.descripcion_servicio || ""
    this.precio_servicio = data.precio_servicio || 0
    this.categoria = data.categoria || ""
    this.disponible = data.disponible ?? true
    this.duracion = data.duracion || 0
  }

  desactivar_servicio(): void {
    this.disponible = false
    console.log(`Servicio ${this.nombre_servicio} desactivado`)
  }

  aplicar_servicio(): void {
    if (this.disponible) {
      console.log(`Aplicando servicio ${this.nombre_servicio}`)
    }
  }

  modificar_precio(): void {
    console.log(`Modificando precio del servicio ${this.nombre_servicio}`)
  }

  validar_disponibilidad(): boolean {
    return this.disponible
  }
}

export class ServicioReservaModel implements ServicioReserva {
  cantidad: number
  precio_unitario: number
  subtotal: number
  fecha_servicio: Date
  id_reserva_fk: number
  id_servicio_fk: number

  constructor(data: Partial<ServicioReserva>) {
    this.cantidad = data.cantidad || 1
    this.precio_unitario = data.precio_unitario || 0
    this.subtotal = data.subtotal || 0
    this.fecha_servicio = data.fecha_servicio || new Date()
    this.id_reserva_fk = data.id_reserva_fk || 0
    this.id_servicio_fk = data.id_servicio_fk || 0
  }

  calcular_subtotal(): void {
    this.subtotal = this.cantidad * this.precio_unitario
    console.log(`Subtotal calculado: ${this.subtotal}`)
  }

  modificar_cantidad(): void {
    console.log(`Modificando cantidad de servicio`)
    this.calcular_subtotal()
  }

  cancelar_servicio(): void {
    this.cantidad = 0
    this.subtotal = 0
    console.log("Servicio cancelado")
  }
}
