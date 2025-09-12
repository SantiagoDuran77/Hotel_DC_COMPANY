// Esquema de base de datos basado en el diagrama de clases

export const DatabaseSchema = {
  // Tabla Usuario (clase base)
  usuario: {
    id_usuario: "INTEGER PRIMARY KEY AUTOINCREMENT",
    nombre_usuario: "VARCHAR(50) NOT NULL",
    correo_usuario: "VARCHAR(50) UNIQUE NOT NULL",
    telefono_usuario: "VARCHAR(50)",
    contrasena_usuario: "VARCHAR(255) NOT NULL",
    tipo_usuario: 'VARCHAR(20) CHECK(tipo_usuario IN ("cliente", "empleado", "admin"))',
    fecha_registro: "DATE DEFAULT CURRENT_DATE",
    estado: 'VARCHAR(20) DEFAULT "activo"',
  },

  // Tabla Cliente (hereda de Usuario)
  cliente: {
    id_cliente: "INTEGER PRIMARY KEY AUTOINCREMENT",
    documento_identidad: "VARCHAR(20) UNIQUE",
    fecha_nacimiento: "DATE",
    direccion: "TEXT",
    preferencias: "TEXT",
    id_usuario_fk: "INTEGER REFERENCES usuario(id_usuario)",
  },

  // Tabla Empleado (hereda de Usuario)
  empleado: {
    id_empleado: "INTEGER PRIMARY KEY AUTOINCREMENT",
    codigo_empleado: "VARCHAR(20) UNIQUE",
    cargo: "VARCHAR(50)",
    departamento: "VARCHAR(50)",
    fecha_contratacion: "DATE",
    salario: "DECIMAL(10,2)",
    id_usuario_fk: "INTEGER REFERENCES usuario(id_usuario)",
  },

  // Tabla Habitacion
  habitacion: {
    id_habitacion: "INTEGER PRIMARY KEY AUTOINCREMENT",
    numero_habitacion: "INTEGER UNIQUE NOT NULL",
    tipo_habitacion: "VARCHAR(50)",
    estado_habitacion: 'VARCHAR(20) DEFAULT "disponible"',
    precio_noche: "DECIMAL(10,2)",
    capacidad_maxima: "INTEGER",
  },

  // Tabla Detalles_Habitacion
  detalles_habitacion: {
    id_detalles: "INTEGER PRIMARY KEY AUTOINCREMENT",
    descripcion: "TEXT",
    comodidades: "TEXT",
    precio_adicional: "DECIMAL(10,2)",
    capacidad: "INTEGER",
    tipo_cama: "VARCHAR(50)",
    id_habitacion_fk: "INTEGER REFERENCES habitacion(id_habitacion)",
  },

  // Tabla Servicio
  servicio: {
    id_servicio: "INTEGER PRIMARY KEY AUTOINCREMENT",
    nombre_servicio: "VARCHAR(50)",
    descripcion_servicio: "TEXT",
    precio_servicio: "DECIMAL(10,2)",
    categoria: "VARCHAR(50)",
    disponible: "BOOLEAN DEFAULT TRUE",
    duracion: "INTEGER",
  },

  // Tabla Reserva
  reserva: {
    id_reserva: "INTEGER PRIMARY KEY AUTOINCREMENT",
    fecha_reserva: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    fecha_llegada: "DATE",
    fecha_salida: "DATE",
    numero_huespedes: "INTEGER",
    estado_reserva: 'VARCHAR(20) DEFAULT "pendiente"',
    precio_total: "DECIMAL(10,2)",
    id_cliente_fk: "INTEGER REFERENCES cliente(id_cliente)",
  },

  // Tabla Detalle_Reserva
  detalle_reserva: {
    id_detalle: "INTEGER PRIMARY KEY AUTOINCREMENT",
    cantidad_especial: "DATE",
    precio_noche: "DECIMAL(10,2)",
    subtotal: "DECIMAL(10,2)",
    id_habitacion_fk: "INTEGER REFERENCES habitacion(id_habitacion)",
    id_reserva_fk: "INTEGER REFERENCES reserva(id_reserva)",
  },

  // Tabla Servicio_Reserva (tabla de unión)
  servicio_reserva: {
    cantidad: "INTEGER",
    precio_unitario: "DECIMAL(10,2)",
    subtotal: "DECIMAL(10,2)",
    fecha_servicio: "DATE",
    id_reserva_fk: "INTEGER REFERENCES reserva(id_reserva)",
    id_servicio_fk: "INTEGER REFERENCES servicio(id_servicio)",
    PRIMARY_KEY: "(id_reserva_fk, id_servicio_fk)",
  },

  // Tabla Factura
  factura: {
    id_factura: "INTEGER PRIMARY KEY AUTOINCREMENT",
    numero_factura: "VARCHAR(50) UNIQUE",
    fecha_emision: "DATE DEFAULT CURRENT_DATE",
    subtotal: "DECIMAL(10,2)",
    impuestos: "DECIMAL(10,2)",
    descuentos: "DECIMAL(10,2)",
    total: "DECIMAL(10,2)",
    estado_factura: 'VARCHAR(20) DEFAULT "pendiente"',
    id_reserva_fk: "INTEGER REFERENCES reserva(id_reserva)",
  },

  // Tabla Pago
  pago: {
    id_pago: "INTEGER PRIMARY KEY AUTOINCREMENT",
    fecha_pago: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    monto_pago: "DECIMAL(10,2)",
    metodo_pago: "VARCHAR(20)",
    estado_pago: 'VARCHAR(20) DEFAULT "pendiente"',
    referencia_pago: "VARCHAR(100)",
    id_factura_fk: "INTEGER REFERENCES factura(id_factura)",
  },
}

// Consultas SQL para crear las tablas
export const CreateTableQueries = {
  createUsuarioTable: `
    CREATE TABLE IF NOT EXISTS usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario VARCHAR(50) NOT NULL,
      correo_usuario VARCHAR(50) UNIQUE NOT NULL,
      telefono_usuario VARCHAR(50),
      contrasena_usuario VARCHAR(255) NOT NULL,
      tipo_usuario VARCHAR(20) CHECK(tipo_usuario IN ('cliente', 'empleado', 'admin')),
      fecha_registro DATE DEFAULT CURRENT_DATE,
      estado VARCHAR(20) DEFAULT 'activo'
    )
  `,

  createClienteTable: `
    CREATE TABLE IF NOT EXISTS cliente (
      id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
      documento_identidad VARCHAR(20) UNIQUE,
      fecha_nacimiento DATE,
      direccion TEXT,
      preferencias TEXT,
      id_usuario_fk INTEGER REFERENCES usuario(id_usuario)
    )
  `,

  createEmpleadoTable: `
    CREATE TABLE IF NOT EXISTS empleado (
      id_empleado INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_empleado VARCHAR(20) UNIQUE,
      cargo VARCHAR(50),
      departamento VARCHAR(50),
      fecha_contratacion DATE,
      salario DECIMAL(10,2),
      id_usuario_fk INTEGER REFERENCES usuario(id_usuario)
    )
  `,

  createHabitacionTable: `
    CREATE TABLE IF NOT EXISTS habitacion (
      id_habitacion INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_habitacion INTEGER UNIQUE NOT NULL,
      tipo_habitacion VARCHAR(50),
      estado_habitacion VARCHAR(20) DEFAULT 'disponible',
      precio_noche DECIMAL(10,2),
      capacidad_maxima INTEGER
    )
  `,

  createDetallesHabitacionTable: `
    CREATE TABLE IF NOT EXISTS detalles_habitacion (
      id_detalles INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT,
      comodidades TEXT,
      precio_adicional DECIMAL(10,2),
      capacidad INTEGER,
      tipo_cama VARCHAR(50),
      id_habitacion_fk INTEGER REFERENCES habitacion(id_habitacion)
    )
  `,

  createServicioTable: `
    CREATE TABLE IF NOT EXISTS servicio (
      id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_servicio VARCHAR(50),
      descripcion_servicio TEXT,
      precio_servicio DECIMAL(10,2),
      categoria VARCHAR(50),
      disponible BOOLEAN DEFAULT TRUE,
      duracion INTEGER
    )
  `,

  createReservaTable: `
    CREATE TABLE IF NOT EXISTS reserva (
      id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_llegada DATE,
      fecha_salida DATE,
      numero_huespedes INTEGER,
      estado_reserva VARCHAR(20) DEFAULT 'pendiente',
      precio_total DECIMAL(10,2),
      id_cliente_fk INTEGER REFERENCES cliente(id_cliente)
    )
  `,

  createDetalleReservaTable: `
    CREATE TABLE IF NOT EXISTS detalle_reserva (
      id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
      cantidad_especial DATE,
      precio_noche DECIMAL(10,2),
      subtotal DECIMAL(10,2),
      id_habitacion_fk INTEGER REFERENCES habitacion(id_habitacion),
      id_reserva_fk INTEGER REFERENCES reserva(id_reserva)
    )
  `,

  createServicioReservaTable: `
    CREATE TABLE IF NOT EXISTS servicio_reserva (
      cantidad INTEGER,
      precio_unitario DECIMAL(10,2),
      subtotal DECIMAL(10,2),
      fecha_servicio DATE,
      id_reserva_fk INTEGER REFERENCES reserva(id_reserva),
      id_servicio_fk INTEGER REFERENCES servicio(id_servicio),
      PRIMARY KEY (id_reserva_fk, id_servicio_fk)
    )
  `,

  createFacturaTable: `
    CREATE TABLE IF NOT EXISTS factura (
      id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_factura VARCHAR(50) UNIQUE,
      fecha_emision DATE DEFAULT CURRENT_DATE,
      subtotal DECIMAL(10,2),
      impuestos DECIMAL(10,2),
      descuentos DECIMAL(10,2),
      total DECIMAL(10,2),
      estado_factura VARCHAR(20) DEFAULT 'pendiente',
      id_reserva_fk INTEGER REFERENCES reserva(id_reserva)
    )
  `,

  createPagoTable: `
    CREATE TABLE IF NOT EXISTS pago (
      id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
      monto_pago DECIMAL(10,2),
      metodo_pago VARCHAR(20),
      estado_pago VARCHAR(20) DEFAULT 'pendiente',
      referencia_pago VARCHAR(100),
      id_factura_fk INTEGER REFERENCES factura(id_factura)
    )
  `,
}
