import type { Factura, Pago } from "../types"

export class FacturaModel implements Factura {
  id_factura: number
  numero_factura: string
  fecha_emision: Date
  subtotal: number
  impuestos: number
  descuentos: number
  total: number
  estado_factura: "pendiente" | "pagada" | "vencida"
  id_reserva_fk: number

  constructor(data: Partial<Factura>) {
    this.id_factura = data.id_factura || 0
    this.numero_factura = data.numero_factura || ""
    this.fecha_emision = data.fecha_emision || new Date()
    this.subtotal = data.subtotal || 0
    this.impuestos = data.impuestos || 0
    this.descuentos = data.descuentos || 0
    this.total = data.total || 0
    this.estado_factura = data.estado_factura || "pendiente"
    this.id_reserva_fk = data.id_reserva_fk || 0
  }

  calcular_total(): void {
    this.total = this.subtotal + this.impuestos - this.descuentos
    console.log(`Total calculado: ${this.total}`)
  }

  aplicar_descuento(): void {
    console.log(`Aplicando descuento de ${this.descuentos}`)
    this.calcular_total()
  }

  generar_numero_factura(): void {
    this.numero_factura = `FAC-${Date.now()}-${this.id_reserva_fk}`
    console.log(`Número de factura generado: ${this.numero_factura}`)
  }

  enviar_factura(): void {
    console.log(`Enviando factura ${this.numero_factura}`)
  }
}

export class PagoModel implements Pago {
  id_pago: number
  fecha_pago: Date
  monto_pago: number
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  estado_pago: "pendiente" | "completado" | "fallido"
  referencia_pago: string
  id_factura_fk: number

  constructor(data: Partial<Pago>) {
    this.id_pago = data.id_pago || 0
    this.fecha_pago = data.fecha_pago || new Date()
    this.monto_pago = data.monto_pago || 0
    this.metodo_pago = data.metodo_pago || "efectivo"
    this.estado_pago = data.estado_pago || "pendiente"
    this.referencia_pago = data.referencia_pago || ""
    this.id_factura_fk = data.id_factura_fk || 0
  }

  procesar_pago(): boolean {
    if (this.validar_transaccion()) {
      this.estado_pago = "completado"
      this.referencia_pago = `PAY-${Date.now()}`
      console.log(`Pago procesado: ${this.referencia_pago}`)
      return true
    }
    this.estado_pago = "fallido"
    return false
  }

  validar_transaccion(): boolean {
    return this.monto_pago > 0
  }

  generar_recibo(): void {
    console.log(`Generando recibo para pago ${this.referencia_pago}`)
  }

  revertir_pago(): boolean {
    if (this.estado_pago === "completado") {
      this.estado_pago = "pendiente"
      console.log(`Pago ${this.referencia_pago} revertido`)
      return true
    }
    return false
  }
}
