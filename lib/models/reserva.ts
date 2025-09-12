import type { Reserva, DetalleReserva } from "../types"

export class ReservaModel implements Reserva {
  id_reserva: number
  fecha_reserva: Date
  fecha_llegada: Date
  fecha_salida: Date
  numero_huespedes: number
  estado_reserva: "pendiente" | "confirmada" | "cancelada" | "completada"
  precio_total: number
  id_cliente_fk: number

  constructor(data: Partial<Reserva>) {
    this.id_reserva = data.id_reserva || 0
    this.fecha_reserva = data.fecha_reserva || new Date()
    this.fecha_llegada = data.fecha_llegada || new Date()
    this.fecha_salida = data.fecha_salida || new Date()
    this.numero_huespedes = data.numero_huespedes || 1
    this.estado_reserva = data.estado_reserva || "pendiente"
    this.precio_total = data.precio_total || 0
    this.id_cliente_fk = data.id_cliente_fk || 0
  }

  confirmar_reserva(): void {
    this.estado_reserva = "confirmada"
    console.log(`Reserva ${this.id_reserva} confirmada`)
  }

  cancelar_reserva(): void {
    this.estado_reserva = "cancelada"
    console.log(`Reserva ${this.id_reserva} cancelada`)
  }

  modificar_reserva(): void {
    console.log(`Modificando reserva ${this.id_reserva}`)
  }

  calcular_costo_total(): void {
    // Lógica para calcular el costo total
    const dias = Math.ceil((this.fecha_salida.getTime() - this.fecha_llegada.getTime()) / (1000 * 60 * 60 * 24))
    // Este cálculo se completaría con los detalles de la reserva
    console.log(`Calculando costo para ${dias} días`)
  }

  generar_confirmacion(): void {
    console.log(`Generando confirmación para reserva ${this.id_reserva}`)
  }

  procesar_checkin(): void {
    console.log(`Procesando check-in para reserva ${this.id_reserva}`)
  }

  procesar_checkout(): void {
    this.estado_reserva = "completada"
    console.log(`Procesando check-out para reserva ${this.id_reserva}`)
  }

  generar_factura(): void {
    console.log(`Generando factura para reserva ${this.id_reserva}`)
  }
}

export class DetalleReservaModel implements DetalleReserva {
  id_detalle: number
  cantidad_especial: Date
  precio_noche: number
  subtotal: number
  id_habitacion_fk: number
  id_reserva_fk: number

  constructor(data: Partial<DetalleReserva>) {
    this.id_detalle = data.id_detalle || 0
    this.cantidad_especial = data.cantidad_especial || new Date()
    this.precio_noche = data.precio_noche || 0
    this.subtotal = data.subtotal || 0
    this.id_habitacion_fk = data.id_habitacion_fk || 0
    this.id_reserva_fk = data.id_reserva_fk || 0
  }

  calcular_subtotal(): void {
    // Lógica para calcular subtotal
    this.subtotal = this.precio_noche
    console.log(`Subtotal calculado: ${this.subtotal}`)
  }

  validar_formato(): void {
    console.log("Validando formato de detalle de reserva")
  }

  validar_disponibilidad(): boolean {
    // Lógica para validar disponibilidad
    return true
  }
}
