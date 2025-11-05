import express from "express"
import { executeQuery, executeTransaction } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"

const router = express.Router()

// Obtener todas las reservas
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const reservations = await executeQuery(`
      SELECT r.id_reserva, r.fecha_reserva, r.fecha_inicio, r.fecha_fin, r.estado_reserva,
             c.nombre_cliente, c.apellido_cliente, c.correo_cliente,
             h.numero_habitacion, h.tipo_habitacion,
             dr.costo_total
      FROM reserva r
      JOIN cliente c ON r.id_cliente = c.id_cliente
      JOIN habitacion h ON r.id_habitacion = h.id_habitacion
      LEFT JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
      ORDER BY r.fecha_reserva DESC
    `)

    res.json({
      reservations: reservations.map(res => ({
        id: res.id_reserva,
        booking_date: res.fecha_reserva,
        start_date: res.fecha_inicio,
        end_date: res.fecha_fin,
        status: res.estado_reserva,
        client_name: `${res.nombre_cliente} ${res.apellido_cliente}`,
        client_email: res.correo_cliente,
        room_number: res.numero_habitacion,
        room_type: res.tipo_habitacion,
        total_cost: res.costo_total
      }))
    })
  })
)

// Obtener reserva por ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const reservations = await executeQuery(`
      SELECT r.*, c.nombre_cliente, c.apellido_cliente, c.correo_cliente, c.telefono_cliente,
             h.numero_habitacion, h.tipo_habitacion, h.precio,
             dr.fecha_checkin, dr.fecha_checkout, dr.costo_total
      FROM reserva r
      JOIN cliente c ON r.id_cliente = c.id_cliente
      JOIN habitacion h ON r.id_habitacion = h.id_habitacion
      LEFT JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
      WHERE r.id_reserva = ?
    `, [id])

    if (!reservations.length) {
      return res.status(404).json({
        error: "Reserva no encontrada",
        code: "RESERVATION_NOT_FOUND"
      })
    }

    const reservation = reservations[0]

    // Obtener servicios de la reserva
    const services = await executeQuery(`
      SELECT sr.*, s.nombre_servicio, s.precio_servicio
      FROM servicio_reserva sr
      JOIN servicio s ON sr.id_servicio = s.id_servicio
      WHERE sr.id_reserva = ?
    `, [id])

    res.json({
      reservation: {
        id: reservation.id_reserva,
        booking_date: reservation.fecha_reserva,
        start_date: reservation.fecha_inicio,
        end_date: reservation.fecha_fin,
        status: reservation.estado_reserva,
        client: {
          name: `${reservation.nombre_cliente} ${reservation.apellido_cliente}`,
          email: reservation.correo_cliente,
          phone: reservation.telefono_cliente
        },
        room: {
          number: reservation.numero_habitacion,
          type: reservation.tipo_habitacion,
          price: reservation.precio
        },
        details: {
          checkin: reservation.fecha_checkin,
          checkout: reservation.fecha_checkout,
          total: reservation.costo_total
        },
        services: services.map(service => ({
          id: service.id_servicio,
          name: service.nombre_servicio,
          quantity: service.cantidad,
          price: service.precio_servicio,
          total: service.precio_total
        }))
      }
    })
  })
)

// Crear nueva reserva MEJORADA
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { 
      cliente_id, 
      habitacion_id, 
      fecha_inicio, 
      fecha_fin,
      servicios = [] // Array de servicios opcionales
    } = req.body

    console.log('📝 Creating reservation:', { cliente_id, habitacion_id, fecha_inicio, fecha_fin, servicios })

    // 1. Verificar disponibilidad de la habitación
    const availabilityCheck = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM reserva r 
      WHERE r.id_habitacion = ? 
      AND r.estado_reserva IN ('Confirmada', 'Pendiente')
      AND (
        (r.fecha_inicio <= ? AND r.fecha_fin > ?) OR
        (r.fecha_inicio < ? AND r.fecha_fin >= ?) OR
        (r.fecha_inicio >= ? AND r.fecha_fin <= ?)
      )
    `, [habitacion_id, fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_fin])

    if (availabilityCheck[0].count > 0) {
      return res.status(400).json({
        error: "La habitación no está disponible en las fechas seleccionadas",
        code: "ROOM_NOT_AVAILABLE"
      })
    }

    // 2. Usar el procedimiento almacenado para crear reserva básica
    await executeQuery(
      "CALL crear_reserva_con_detalle(?, ?, ?, ?, ?)",
      [cliente_id, 1, habitacion_id, fecha_inicio, fecha_fin] // id_empleado 1 por defecto
    )

    // 3. Obtener el ID de la reserva recién creada
    const lastReservation = await executeQuery(
      "SELECT LAST_INSERT_ID() as reservation_id"
    )
    const reservationId = lastReservation[0].reservation_id

    // 4. Agregar servicios si se proporcionaron
    if (servicios.length > 0) {
      for (const servicio of servicios) {
        await executeQuery(
          `INSERT INTO servicio_reserva (id_reserva, id_servicio, cantidad, precio_total) 
           VALUES (?, ?, ?, ?)`,
          [reservationId, servicio.id_servicio, servicio.cantidad || 1, servicio.precio_total]
        )
      }
    }

    res.status(201).json({
      message: "Reserva creada exitosamente",
      reservation_id: reservationId
    })
  })
)

// Cancelar reserva
router.put(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const result = await executeQuery(
      "UPDATE reserva SET estado_reserva = 'Cancelada' WHERE id_reserva = ? AND estado_reserva IN ('Pendiente', 'Confirmada')",
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Reserva no encontrada o no se puede cancelar",
        code: "RESERVATION_CANNOT_BE_CANCELLED"
      })
    }

    res.json({
      message: "Reserva cancelada exitosamente"
    })
  })
)

export default router