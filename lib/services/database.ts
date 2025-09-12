import type { Usuario, Cliente, Empleado, Reserva, Habitacion, Servicio, Factura, Pago } from "../types"

// Simulación de base de datos en memoria para el ejemplo
class DatabaseService {
  private usuarios: Usuario[] = []
  private clientes: Cliente[] = []
  private empleados: Empleado[] = []
  private habitaciones: Habitacion[] = []
  private servicios: Servicio[] = []
  private reservas: Reserva[] = []
  private facturas: Factura[] = []
  private pagos: Pago[] = []

  constructor() {
    this.initializeDatabase()
  }

  private initializeDatabase() {
    // En una aplicación real, aquí se ejecutarían las consultas SQL
    console.log("Inicializando base de datos...")
    this.seedData()
  }

  private seedData() {
    // Datos de prueba
    this.usuarios = [
      {
        id_usuario: 1,
        nombre_usuario: "Admin Sistema",
        correo_usuario: "admin@hotel.com",
        telefono_usuario: "+1234567890",
        contrasena_usuario: "admin123",
        tipo_usuario: "admin",
        fecha_registro: new Date(),
        estado: "activo",
        iniciar_sesion: () => true,
        cerrar_sesion: () => {},
        actualizar_perfil: () => {},
        cambiar_contrasena: () => true,
        validar_usuario: () => true,
      },
      {
        id_usuario: 2,
        nombre_usuario: "Juan Pérez",
        correo_usuario: "juan@email.com",
        telefono_usuario: "+1234567891",
        contrasena_usuario: "cliente123",
        tipo_usuario: "cliente",
        fecha_registro: new Date(),
        estado: "activo",
        iniciar_sesion: () => true,
        cerrar_sesion: () => {},
        actualizar_perfil: () => {},
        cambiar_contrasena: () => true,
        validar_usuario: () => true,
      },
    ]

    this.habitaciones = [
      {
        id_habitacion: 1,
        numero_habitacion: 101,
        tipo_habitacion: "Estándar",
        estado_habitacion: "disponible",
        precio_noche: 120.0,
        capacidad_maxima: 2,
        verificar_disponibilidad: () => true,
        cambiar_estado: () => {},
        actualizar_precio: () => {},
        validar_ocupacion: () => false,
        programar_mantenimiento: () => {},
      },
      {
        id_habitacion: 2,
        numero_habitacion: 102,
        tipo_habitacion: "Deluxe",
        estado_habitacion: "disponible",
        precio_noche: 180.0,
        capacidad_maxima: 3,
        verificar_disponibilidad: () => true,
        cambiar_estado: () => {},
        actualizar_precio: () => {},
        validar_ocupacion: () => false,
        programar_mantenimiento: () => {},
      },
    ]

    this.servicios = [
      {
        id_servicio: 1,
        nombre_servicio: "Servicio de habitaciones",
        descripcion_servicio: "Comida y bebida a la habitación",
        precio_servicio: 25.0,
        categoria: "Habitación",
        disponible: true,
        duracion: 30,
        desactivar_servicio: () => {},
        aplicar_servicio: () => {},
        modificar_precio: () => {},
        validar_disponibilidad: () => true,
      },
      {
        id_servicio: 2,
        nombre_servicio: "Spa",
        descripcion_servicio: "Acceso completo al spa",
        precio_servicio: 80.0,
        categoria: "Bienestar",
        disponible: true,
        duracion: 120,
        desactivar_servicio: () => {},
        aplicar_servicio: () => {},
        modificar_precio: () => {},
        validar_disponibilidad: () => true,
      },
    ]
  }

  // Métodos CRUD para Usuario
  async createUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    const newUsuario = {
      id_usuario: this.usuarios.length + 1,
      ...usuario,
      fecha_registro: new Date(),
      estado: "activo",
      iniciar_sesion: () => true,
      cerrar_sesion: () => {},
      actualizar_perfil: () => {},
      cambiar_contrasena: () => true,
      validar_usuario: () => true,
    } as Usuario

    this.usuarios.push(newUsuario)
    return newUsuario
  }

  async getUsuarios(): Promise<Usuario[]> {
    return this.usuarios
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.id_usuario === id) || null
  }

  async updateUsuario(id: number, updates: Partial<Usuario>): Promise<Usuario | null> {
    const index = this.usuarios.findIndex((u) => u.id_usuario === id)
    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...updates }
      return this.usuarios[index]
    }
    return null
  }

  async deleteUsuario(id: number): Promise<boolean> {
    const index = this.usuarios.findIndex((u) => u.id_usuario === id)
    if (index !== -1) {
      this.usuarios.splice(index, 1)
      return true
    }
    return false
  }

  // Métodos CRUD para Habitacion
  async createHabitacion(habitacion: Partial<Habitacion>): Promise<Habitacion> {
    const newHabitacion = {
      id_habitacion: this.habitaciones.length + 1,
      ...habitacion,
      estado_habitacion: "disponible",
      verificar_disponibilidad: () => true,
      cambiar_estado: () => {},
      actualizar_precio: () => {},
      validar_ocupacion: () => false,
      programar_mantenimiento: () => {},
    } as Habitacion

    this.habitaciones.push(newHabitacion)
    return newHabitacion
  }

  async getHabitaciones(): Promise<Habitacion[]> {
    return this.habitaciones
  }

  async getHabitacionById(id: number): Promise<Habitacion | null> {
    return this.habitaciones.find((h) => h.id_habitacion === id) || null
  }

  // Métodos CRUD para Servicio
  async createServicio(servicio: Partial<Servicio>): Promise<Servicio> {
    const newServicio = {
      id_servicio: this.servicios.length + 1,
      ...servicio,
      disponible: true,
      desactivar_servicio: () => {},
      aplicar_servicio: () => {},
      modificar_precio: () => {},
      validar_disponibilidad: () => true,
    } as Servicio

    this.servicios.push(newServicio)
    return newServicio
  }

  async getServicios(): Promise<Servicio[]> {
    return this.servicios
  }

  // Métodos CRUD para Reserva
  async createReserva(reserva: Partial<Reserva>): Promise<Reserva> {
    const newReserva = {
      id_reserva: this.reservas.length + 1,
      ...reserva,
      fecha_reserva: new Date(),
      estado_reserva: "pendiente",
      confirmar_reserva: () => {},
      cancelar_reserva: () => {},
      modificar_reserva: () => {},
      calcular_costo_total: () => {},
      generar_confirmacion: () => {},
      procesar_checkin: () => {},
      procesar_checkout: () => {},
      generar_factura: () => {},
    } as Reserva

    this.reservas.push(newReserva)
    return newReserva
  }

  async getReservas(): Promise<Reserva[]> {
    return this.reservas
  }

  async getReservasByCliente(clienteId: number): Promise<Reserva[]> {
    return this.reservas.filter((r) => r.id_cliente_fk === clienteId)
  }

  // Métodos para reportes y estadísticas
  async getOccupancyRate(): Promise<number> {
    const totalRooms = this.habitaciones.length
    const occupiedRooms = this.habitaciones.filter((h) => h.estado_habitacion === "ocupada").length
    return totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    return this.reservas
      .filter((r) => r.fecha_reserva >= startDate && r.fecha_reserva <= endDate)
      .reduce((total, r) => total + r.precio_total, 0)
  }

  async getAvailableRooms(checkIn: Date, checkOut: Date): Promise<Habitacion[]> {
    // Lógica simplificada - en una aplicación real sería más compleja
    return this.habitaciones.filter((h) => h.estado_habitacion === "disponible")
  }
}

export const databaseService = new DatabaseService()
