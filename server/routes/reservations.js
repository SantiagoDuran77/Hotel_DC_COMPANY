import express from "express"
import { executeQuery } from "../config/database.js"
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

// Crear nueva reserva
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { cliente_id, habitacion_id, fecha_inicio, fecha_fin } = req.body

    // Usar el procedimiento almacenado que ya tienes
    await executeQuery(
      "CALL crear_reserva_con_detalle(?, ?, ?, ?, ?)",
      [cliente_id, 1, habitacion_id, fecha_inicio, fecha_fin]
    )

    res.status(201).json({
      message: "Reserva creada exitosamente"
    })
  })
)

export default router