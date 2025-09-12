// Tipos base del sistema Hotel DC Company

export interface Usuario {
  id_usuario: number
  nombre_usuario: string
  correo_usuario: string
  telefono_usuario: string
  contrasena_usuario: string
  tipo_usuario: "cliente" | "empleado" | "admin"
  fecha_registro: Date
  estado: "activo" | "inactivo"

  // Métodos
  iniciar_sesion(): boolean
  cerrar_sesion(): void
  actualizar_perfil(): void
  cambiar_contrasena(): boolean
  validar_usuario(): boolean
}

export interface Cliente extends Usuario {
  id_cliente: number
  documento_identidad: string
  fecha_nacimiento: Date
  direccion: string
  preferencias: string
  id_usuario_fk: number

  // Métodos específicos del cliente
  realizar_reserva(): void
  modificar_reserva(): void
  cancelar_reserva(): void
  consultar_reservas(): Reserva[]
  solicitar_servicios(): void
  actualizar_perfil(): void
  consultar_facturas(): void
}

export interface Empleado extends Usuario {
  id_empleado: number
  codigo_empleado: string
  cargo: string
  departamento: string
  id_usuario_fk: number
  fecha_contratacion: Date
  salario: number

  // Métodos específicos del empleado
  consultar_disponibilidad(): void
  gestionar_reservas(): void
  atender_cliente(): void
  generar_reportes(): void
  procesar_checkin(): void
  procesar_checkout(): void
}

export interface Servicio {
  id_servicio: number
  nombre_servicio: string
  descripcion_servicio: string
  precio_servicio: number
  categoria: string
  disponible: boolean
  duracion: number

  // Métodos
  desactivar_servicio(): void
  aplicar_servicio(): void
  modificar_precio(): void
  validar_disponibilidad(): boolean
}

export interface ServicioReserva {
  cantidad: number
  precio_unitario: number
  subtotal: number
  fecha_servicio: Date
  id_reserva_fk: number
  id_servicio_fk: number

  // Métodos
  calcular_subtotal(): void
  modificar_cantidad(): void
  cancelar_servicio(): void
}

export interface Reserva {
  id_reserva: number
  fecha_reserva: Date
  fecha_llegada: Date
  fecha_salida: Date
  numero_huespedes: number
  estado_reserva: "pendiente" | "confirmada" | "cancelada" | "completada"
  precio_total: number
  id_cliente_fk: number

  // Métodos
  confirmar_reserva(): void
  cancelar_reserva(): void
  modificar_reserva(): void
  calcular_costo_total(): void
  generar_confirmacion(): void
  procesar_checkin(): void
  procesar_checkout(): void
  generar_factura(): void
}

export interface DetalleReserva {
  id_detalle: number
  cantidad_especial: Date
  precio_noche: number
  subtotal: number
  id_habitacion_fk: number
  id_reserva_fk: number

  // Métodos
  calcular_subtotal(): void
  validar_formato(): void
  validar_disponibilidad(): boolean
}

export interface Habitacion {
  id_habitacion: number
  numero_habitacion: number
  tipo_habitacion: string
  estado_habitacion: "disponible" | "ocupada" | "mantenimiento" | "limpieza"
  precio_noche: number
  capacidad_maxima: number

  // Métodos
  verificar_disponibilidad(): boolean
  cambiar_estado(): void
  actualizar_precio(): void
  validar_ocupacion(): boolean
  programar_mantenimiento(): void
}

export interface DetallesHabitacion {
  id_detalles: number
  descripcion: string
  comodidades: string
  precio_adicional: number
  capacidad: number
  tipo_cama: string

  // Métodos
  actualizar_detalles(): void
  validar_capacidad(): boolean
  obtener_comodidades(): void
  actualizar_precio(): void
  validar_comodidad(): boolean
}

export interface Factura {
  id_factura: number
  numero_factura: string
  fecha_emision: Date
  subtotal: number
  impuestos: number
  descuentos: number
  total: number
  estado_factura: "pendiente" | "pagada" | "vencida"
  id_reserva_fk: number

  // Métodos
  calcular_total(): void
  aplicar_descuento(): void
  generar_numero_factura(): void
  enviar_factura(): void
}

export interface Pago {
  id_pago: number
  fecha_pago: Date
  monto_pago: number
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  estado_pago: "pendiente" | "completado" | "fallido"
  referencia_pago: string
  id_factura_fk: number

  // Métodos
  procesar_pago(): boolean
  validar_transaccion(): boolean
  generar_recibo(): void
  revertir_pago(): boolean
}

// Tipos adicionales para el sistema
export interface Room extends Habitacion {
  name: string
  description: string
  price: number
  capacity: number
  image: string
  images?: string[]
  amenities: string[]
  isAvailable?: boolean
  floor?: number
  bedType?: string
  view?: string
  roomNumber?: number
}

export interface User extends Usuario {
  name: string
  email: string
  role: string
  status: string
  lastLogin?: string
  avatar?: string
}

export interface Booking extends Reserva {
  roomId: string
  guestName: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  paymentStatus: string
  createdAt: string
}

export interface Service extends Servicio {
  name: string
  category: string
  price: number
  description: string
  isAvailable: boolean
  image?: string
}
