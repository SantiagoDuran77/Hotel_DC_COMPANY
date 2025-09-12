import type { Usuario, Cliente, Empleado } from "../types"

export class UsuarioModel implements Usuario {
  id_usuario: number
  nombre_usuario: string
  correo_usuario: string
  telefono_usuario: string
  contrasena_usuario: string
  tipo_usuario: "cliente" | "empleado" | "admin"
  fecha_registro: Date
  estado: "activo" | "inactivo"

  constructor(data: Partial<Usuario>) {
    this.id_usuario = data.id_usuario || 0
    this.nombre_usuario = data.nombre_usuario || ""
    this.correo_usuario = data.correo_usuario || ""
    this.telefono_usuario = data.telefono_usuario || ""
    this.contrasena_usuario = data.contrasena_usuario || ""
    this.tipo_usuario = data.tipo_usuario || "cliente"
    this.fecha_registro = data.fecha_registro || new Date()
    this.estado = data.estado || "activo"
  }

  iniciar_sesion(): boolean {
    // Lógica de autenticación
    if (this.estado === "activo" && this.validar_usuario()) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: this.id_usuario,
          name: this.nombre_usuario,
          email: this.correo_usuario,
          role: this.tipo_usuario,
        }),
      )
      return true
    }
    return false
  }

  cerrar_sesion(): void {
    localStorage.removeItem("currentUser")
  }

  actualizar_perfil(): void {
    // Lógica para actualizar perfil
    console.log("Perfil actualizado")
  }

  cambiar_contrasena(): boolean {
    // Lógica para cambiar contraseña
    return true
  }

  validar_usuario(): boolean {
    return this.correo_usuario.includes("@") && this.nombre_usuario.length > 0
  }
}

export class ClienteModel extends UsuarioModel implements Cliente {
  id_cliente: number
  documento_identidad: string
  fecha_nacimiento: Date
  direccion: string
  preferencias: string
  id_usuario_fk: number

  constructor(data: Partial<Cliente>) {
    super(data)
    this.id_cliente = data.id_cliente || 0
    this.documento_identidad = data.documento_identidad || ""
    this.fecha_nacimiento = data.fecha_nacimiento || new Date()
    this.direccion = data.direccion || ""
    this.preferencias = data.preferencias || ""
    this.id_usuario_fk = data.id_usuario_fk || this.id_usuario
  }

  realizar_reserva(): void {
    console.log("Realizando reserva...")
  }

  modificar_reserva(): void {
    console.log("Modificando reserva...")
  }

  cancelar_reserva(): void {
    console.log("Cancelando reserva...")
  }

  consultar_reservas(): any[] {
    return []
  }

  solicitar_servicios(): void {
    console.log("Solicitando servicios...")
  }

  consultar_facturas(): void {
    console.log("Consultando facturas...")
  }
}

export class EmpleadoModel extends UsuarioModel implements Empleado {
  id_empleado: number
  codigo_empleado: string
  cargo: string
  departamento: string
  id_usuario_fk: number
  fecha_contratacion: Date
  salario: number

  constructor(data: Partial<Empleado>) {
    super(data)
    this.id_empleado = data.id_empleado || 0
    this.codigo_empleado = data.codigo_empleado || ""
    this.cargo = data.cargo || ""
    this.departamento = data.departamento || ""
    this.id_usuario_fk = data.id_usuario_fk || this.id_usuario
    this.fecha_contratacion = data.fecha_contratacion || new Date()
    this.salario = data.salario || 0
  }

  consultar_disponibilidad(): void {
    console.log("Consultando disponibilidad...")
  }

  gestionar_reservas(): void {
    console.log("Gestionando reservas...")
  }

  atender_cliente(): void {
    console.log("Atendiendo cliente...")
  }

  generar_reportes(): void {
    console.log("Generando reportes...")
  }

  procesar_checkin(): void {
    console.log("Procesando check-in...")
  }

  procesar_checkout(): void {
    console.log("Procesando check-out...")
  }
}
