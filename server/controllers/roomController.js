import { executeQuery } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"

// Obtener todas las habitaciones
export const getRooms = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    tipo = "",
    estado = "",
    disponible = "",
    precio_min = 0,
    precio_max = 999999999,
  } = req.query

  const offset = (page - 1) * limit

  const whereConditions = ["h.estado = 1"]
  const params = []

  if (tipo) {
    whereConditions.push("h.tipo_habitacion = ?")
    params.push(tipo)
  }

  if (estado) {
    whereConditions.push("h.estado_habitacion = ?")
    params.push(estado)
  }

  if (disponible === "true") {
    whereConditions.push('h.estado_habitacion = "disponible"')
  }

  whereConditions.push("h.costo_habitacion BETWEEN ? AND ?")
  params.push(precio_min, precio_max)

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

  // Consulta principal con detalles
  const query = `
    SELECT h.*, dh.descripcion_corta, dh.descripcion_larga, dh.comodidades, dh.imagenes
    FROM habitacion h
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
    FROM habitacion h
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
      precio: room.costo_habitacion,
      capacidad: room.capacidad_personas,
      amenidades: room.amenidades,
      descripcion_corta: room.descripcion_corta,
      descripcion_larga: room.descripcion_larga,
      comodidades: room.comodidades,
      imagenes: room.imagenes ? room.imagenes.split(",") : [],
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
    SELECT h.*, dh.descripcion_corta, dh.descripcion_larga, dh.comodidades, dh.imagenes
    FROM habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    WHERE h.id_habitacion = ? AND h.estado = 1
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
    precio: room.costo_habitacion,
    capacidad: room.capacidad_personas,
    amenidades: room.amenidades,
    descripcion_corta: room.descripcion_corta,
    descripcion_larga: room.descripcion_larga,
    comodidades: room.comodidades,
    imagenes: room.imagenes ? room.imagenes.split(",") : [],
  })
})

// Crear nueva habitación (solo admin)
export const createRoom = asyncHandler(async (req, res) => {
  const {
    numero_habitacion,
    tipo_habitacion,
    costo_habitacion,
    capacidad_personas,
    amenidades,
    descripcion_corta,
    descripcion_larga,
    comodidades,
  } = req.body

  // Verificar que no existe habitación con ese número
  const existingRoom = await executeQuery("SELECT id_habitacion FROM habitacion WHERE numero_habitacion = ?", [
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
    INSERT INTO habitacion (numero_habitacion, tipo_habitacion, costo_habitacion, 
                           capacidad_personas, amenidades)
    VALUES (?, ?, ?, ?, ?)
  `,
    [numero_habitacion, tipo_habitacion, costo_habitacion, capacidad_personas, amenidades],
  )

  const roomId = roomResult.insertId

  // Insertar detalles si se proporcionan
  if (descripcion_corta || descripcion_larga || comodidades) {
    await executeQuery(
      `
      INSERT INTO detalles_habitacion (id_habitacion, descripcion_corta, descripcion_larga, 
                                     precio_base, comodidades)
      VALUES (?, ?, ?, ?, ?)
    `,
      [roomId, descripcion_corta, descripcion_larga, costo_habitacion, comodidades],
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
  const { numero_habitacion, tipo_habitacion, estado_habitacion, costo_habitacion, capacidad_personas, amenidades } =
    req.body

  // Verificar que la habitación existe
  const existingRoom = await executeQuery("SELECT id_habitacion FROM habitacion WHERE id_habitacion = ?", [id])

  if (!existingRoom.length) {
    return res.status(404).json({
      error: "Habitación no encontrada",
      code: "ROOM_NOT_FOUND",
    })
  }

  // Actualizar habitación
  await executeQuery(
    `
    UPDATE habitacion 
    SET numero_habitacion = ?, tipo_habitacion = ?, estado_habitacion = ?,
        costo_habitacion = ?, capacidad_personas = ?, amenidades = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id_habitacion = ?
  `,
    [numero_habitacion, tipo_habitacion, estado_habitacion, costo_habitacion, capacidad_personas, amenidades, id],
  )

  res.json({
    message: "Habitación actualizada exitosamente",
  })
})

// Eliminar habitación (solo admin)
export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Verificar que la habitación existe
  const existingRoom = await executeQuery("SELECT id_habitacion FROM habitacion WHERE id_habitacion = ?", [id])

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
    FROM reserva r
    JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
    WHERE dr.id_habitacion = ? AND r.estado_reserva IN ('pendiente', 'confirmada')
  `,
    [id],
  )

  if (activeReservations.length > 0) {
    return res.status(400).json({
      error: "No se puede eliminar la habitación porque tiene reservas activas",
      code: "ROOM_HAS_ACTIVE_RESERVATIONS",
    })
  }

  // Soft delete
  await executeQuery("UPDATE habitacion SET estado = 0, updated_at = CURRENT_TIMESTAMP WHERE id_habitacion = ?", [id])

  res.json({
    message: "Habitación eliminada exitosamente",
  })
})

// Verificar disponibilidad
export const checkAvailability = asyncHandler(async (req, res) => {
  const { fecha_llegada, fecha_salida, huespedes = 1 } = req.query

  if (!fecha_llegada || !fecha_salida) {
    return res.status(400).json({
      error: "Fechas de llegada y salida son requeridas",
      code: "MISSING_DATES",
    })
  }

  // Habitaciones disponibles (no ocupadas en las fechas solicitadas)
  const availableRooms = await executeQuery(
    `
    SELECT h.*, dh.descripcion_corta, dh.comodidades
    FROM habitacion h
    LEFT JOIN detalles_habitacion dh ON h.id_habitacion = dh.id_habitacion
    WHERE h.estado = 1 
    AND h.estado_habitacion = 'disponible'
    AND h.capacidad_personas >= ?
    AND h.id_habitacion NOT IN (
      SELECT DISTINCT dr.id_habitacion
      FROM detalle_reserva dr
      JOIN reserva r ON dr.id_reserva = r.id_reserva
      WHERE r.estado_reserva IN ('confirmada', 'pendiente')
      AND (
        (r.fecha_llegada <= ? AND r.fecha_salida > ?) OR
        (r.fecha_llegada < ? AND r.fecha_salida >= ?) OR
        (r.fecha_llegada >= ? AND r.fecha_salida <= ?)
      )
    )
    ORDER BY h.costo_habitacion
  `,
    [huespedes, fecha_llegada, fecha_llegada, fecha_salida, fecha_salida, fecha_llegada, fecha_salida],
  )

  res.json({
    available_rooms: availableRooms.map((room) => ({
      id: room.id_habitacion,
      numero: room.numero_habitacion,
      tipo: room.tipo_habitacion,
      precio: room.costo_habitacion,
      capacidad: room.capacidad_personas,
      descripcion: room.descripcion_corta,
      comodidades: room.comodidades,
    })),
    total: availableRooms.length,
  })
})
