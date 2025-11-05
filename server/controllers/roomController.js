import { executeQuery } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"

// Obtener todas las habitaciones
export const getRooms = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    tipo = "",
    estado = "",
    precio_min = 0,
    precio_max = 999999999,
  } = req.query

  const offset = (page - 1) * limit

  const whereConditions = ["1=1"] // Siempre verdadero para simplificar
  const params = []

  if (tipo) {
    whereConditions.push("h.tipo_habitacion = ?")
    params.push(tipo)
  }

  if (estado) {
    whereConditions.push("h.estado_habitacion = ?")
    params.push(estado)
  }

  whereConditions.push("h.precio BETWEEN ? AND ?")
  params.push(precio_min, precio_max)

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

  // Consulta principal con detalles - CORREGIDA para tu esquema
  const query = `
    SELECT h.*, dh.descripcion, dh.capacidad, dh.servicios_incluidos
    FROM Habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    ${whereClause}
    ORDER BY h.numero_habitacion
    LIMIT ? OFFSET ?
  `

  params.push(Number.parseInt(limit), Number.parseInt(offset))

  const rooms = await executeQuery(query, params)

  // Contar total para paginación
  const countQuery = `
    SELECT COUNT(*) as total
    FROM Habitacion h
    ${whereClause}
  `

  const countParams = params.slice(0, -2) // Remover limit y offset
  const totalResult = await executeQuery(countQuery, countParams)
  const total = totalResult[0].total

  res.json({
    rooms: rooms.map((room) => ({
      id: room.id_habitacion,
      numero: room.numero_habitacion,
      tipo: room.tipo_habitacion,
      estado: room.estado_habitacion,
      precio: room.precio,
      descripcion: room.descripcion,
      capacidad: room.capacidad,
      servicios_incluidos: room.servicios_incluidos,
    })),
    pagination: {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

// Obtener habitación por ID
export const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const rooms = await executeQuery(
    `
    SELECT h.*, dh.descripcion, dh.capacidad, dh.servicios_incluidos
    FROM Habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    WHERE h.id_habitacion = ?
  `,
    [id],
  )

  if (!rooms.length) {
    return res.status(404).json({
      error: "Habitación no encontrada",
      code: "ROOM_NOT_FOUND",
    })
  }

  const room = rooms[0]

  res.json({
    id: room.id_habitacion,
    numero: room.numero_habitacion,
    tipo: room.tipo_habitacion,
    estado: room.estado_habitacion,
    precio: room.precio,
    descripcion: room.descripcion,
    capacidad: room.capacidad,
    servicios_incluidos: room.servicios_incluidos,
  })
})

// Crear nueva habitación (solo admin)
export const createRoom = asyncHandler(async (req, res) => {
  const {
    numero_habitacion,
    tipo_habitacion,
    precio,
    descripcion,
    capacidad,
    servicios_incluidos,
  } = req.body

  // Verificar que no existe habitación con ese número
  const existingRoom = await executeQuery("SELECT id_habitacion FROM Habitacion WHERE numero_habitacion = ?", [
    numero_habitacion,
  ])

  if (existingRoom.length > 0) {
    return res.status(409).json({
      error: "Ya existe una habitación con ese número",
      code: "ROOM_NUMBER_EXISTS",
    })
  }

  // Insertar habitación
  const roomResult = await executeQuery(
    `
    INSERT INTO Habitacion (numero_habitacion, tipo_habitacion, precio, estado_habitacion)
    VALUES (?, ?, ?, 'Disponible')
  `,
    [numero_habitacion, tipo_habitacion, precio],
  )

  const roomId = roomResult.insertId

  // Insertar detalles si se proporcionan
  if (descripcion || capacidad || servicios_incluidos) {
    await executeQuery(
      `
      INSERT INTO detalles_habitacion (id_habitacion, descripcion, capacidad, servicios_incluidos)
      VALUES (?, ?, ?, ?)
    `,
      [roomId, descripcion, capacidad, servicios_incluidos],
    )
  }

  res.status(201).json({
    message: "Habitación creada exitosamente",
    roomId,
  })
})

// Actualizar habitación (solo admin)
export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { numero_habitacion, tipo_habitacion, estado_habitacion, precio } = req.body

  // Verificar que la habitación existe
  const existingRoom = await executeQuery("SELECT id_habitacion FROM Habitacion WHERE id_habitacion = ?", [id])

  if (!existingRoom.length) {
    return res.status(404).json({
      error: "Habitación no encontrada",
      code: "ROOM_NOT_FOUND",
    })
  }

  // Actualizar habitación
  await executeQuery(
    `
    UPDATE Habitacion 
    SET numero_habitacion = ?, tipo_habitacion = ?, estado_habitacion = ?, precio = ?
    WHERE id_habitacion = ?
  `,
    [numero_habitacion, tipo_habitacion, estado_habitacion, precio, id],
  )

  res.json({
    message: "Habitación actualizada exitosamente",
  })
})

// Eliminar habitación (solo admin) - Cambiar estado a Mantenimiento
export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Verificar que la habitación existe
  const existingRoom = await executeQuery("SELECT id_habitacion FROM Habitacion WHERE id_habitacion = ?", [id])

  if (!existingRoom.length) {
    return res.status(404).json({
      error: "Habitación no encontrada",
      code: "ROOM_NOT_FOUND",
    })
  }

  // Verificar que no tiene reservas activas
  const activeReservations = await executeQuery(
    `
    SELECT r.id_reserva 
    FROM Reserva r
    WHERE r.id_habitacion = ? AND r.estado_reserva IN ('Pendiente', 'Confirmada')
  `,
    [id],
  )

  if (activeReservations.length > 0) {
    return res.status(400).json({
      error: "No se puede eliminar la habitación porque tiene reservas activas",
      code: "ROOM_HAS_ACTIVE_RESERVATIONS",
    })
  }

  // Cambiar estado a Mantenimiento en lugar de eliminar
  await executeQuery("UPDATE Habitacion SET estado_habitacion = 'Mantenimiento' WHERE id_habitacion = ?", [id])

  res.json({
    message: "Habitación puesta en mantenimiento exitosamente",
  })
})

// Verificar disponibilidad
export const checkAvailability = asyncHandler(async (req, res) => {
  const { fecha_inicio, fecha_fin, tipo_habitacion } = req.query

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      error: "Fechas de inicio y fin son requeridas",
      code: "MISSING_DATES",
    })
  }

  // Habitaciones disponibles (no ocupadas en las fechas solicitadas)
  const availableRooms = await executeQuery(
    `
    SELECT h.*, dh.descripcion, dh.capacidad, dh.servicios_incluidos
    FROM Habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    WHERE h.estado_habitacion = 'Disponible'
    ${tipo_habitacion ? "AND h.tipo_habitacion = ?" : ""}
    AND h.id_habitacion NOT IN (
      SELECT DISTINCT r.id_habitacion
      FROM Reserva r
      WHERE r.estado_reserva IN ('Confirmada', 'Pendiente')
      AND (
        (r.fecha_inicio <= ? AND r.fecha_fin > ?) OR
        (r.fecha_inicio < ? AND r.fecha_fin >= ?) OR
        (r.fecha_inicio >= ? AND r.fecha_fin <= ?)
      )
    )
    ORDER BY h.precio
  `,
    tipo_habitacion 
      ? [tipo_habitacion, fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_fin]
      : [fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_fin]
  )

  res.json({
    available_rooms: availableRooms.map((room) => ({
      id: room.id_habitacion,
      numero: room.numero_habitacion,
      tipo: room.tipo_habitacion,
      precio: room.precio,
      estado: room.estado_habitacion,
      descripcion: room.descripcion,
      capacidad: room.capacidad,
      servicios_incluidos: room.servicios_incluidos,
    })),
    total: availableRooms.length,
  })
})

// Endpoint específico para disponibilidad
export const getRoomAvailability = asyncHandler(async (req, res) => {
  const { fecha_inicio, fecha_fin, tipo_habitacion, huespedes } = req.query

  let whereConditions = ["h.estado_habitacion = 'Disponible'"]
  const params = []

  if (tipo_habitacion) {
    whereConditions.push("h.tipo_habitacion = ?")
    params.push(tipo_habitacion)
  }

  if (huespedes) {
    whereConditions.push("dh.capacidad >= ?")
    params.push(Number.parseInt(huespedes))
  }

  // Si hay fechas, verificar conflictos con reservas
  if (fecha_inicio && fecha_fin) {
    whereConditions.push(`
      h.id_habitacion NOT IN (
        SELECT DISTINCT r.id_habitacion
        FROM Reserva r
        WHERE r.estado_reserva IN ('Confirmada', 'Pendiente')
        AND (
          (r.fecha_inicio <= ? AND r.fecha_fin > ?) OR
          (r.fecha_inicio < ? AND r.fecha_fin >= ?) OR
          (r.fecha_inicio >= ? AND r.fecha_fin <= ?)
        )
      )
    `)
    params.push(fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_fin)
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

  const availableRooms = await executeQuery(
    `
    SELECT h.*, dh.descripcion, dh.capacidad, dh.servicios_incluidos
    FROM Habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    ${whereClause}
    ORDER BY h.precio
  `,
    params
  )

  res.json({
    available_rooms: availableRooms.map((room) => ({
      id: room.id_habitacion,
      numero: room.numero_habitacion,
      tipo: room.tipo_habitacion,
      precio: room.precio,
      estado: room.estado_habitacion,
      descripcion: room.descripcion,
      capacidad: room.capacidad,
      servicios_incluidos: room.servicios_incluidos,
    })),
    total: availableRooms.length,
  })
})