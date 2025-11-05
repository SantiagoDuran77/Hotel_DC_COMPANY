import express from "express"
import { executeQuery } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"

const router = express.Router()

// Obtener todos los usuarios (solo admin)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await executeQuery(`
      SELECT u.id_usuario, u.correo_usuario, u.usuario_acceso, u.estado_usuario, u.fecha_registro,
             c.nombre_cliente, c.apellido_cliente, c.telefono_cliente
      FROM usuario u
      LEFT JOIN cliente c ON u.correo_usuario = c.correo_cliente
      ORDER BY u.fecha_registro DESC
    `)

    res.json({
      users: users.map(user => ({
        id: user.id_usuario,
        email: user.correo_usuario,
        role: user.usuario_acceso,
        status: user.estado_usuario,
        registration_date: user.fecha_registro,
        name: user.nombre_cliente,
        last_name: user.apellido_cliente,
        phone: user.telefono_cliente
      }))
    })
  })
)

// Obtener usuario por ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const users = await executeQuery(
      `
      SELECT u.id_usuario, u.correo_usuario, u.usuario_acceso, u.estado_usuario, u.fecha_registro,
             c.nombre_cliente, c.apellido_cliente, c.telefono_cliente, c.direccion_cliente, c.nacionalidad
      FROM usuario u
      LEFT JOIN cliente c ON u.correo_usuario = c.correo_cliente
      WHERE u.id_usuario = ?
    `,
      [id]
    )

    if (!users.length) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        code: "USER_NOT_FOUND"
      })
    }

    const user = users[0]

    res.json({
      id: user.id_usuario,
      email: user.correo_usuario,
      role: user.usuario_acceso,
      status: user.estado_usuario,
      registration_date: user.fecha_registro,
      name: user.nombre_cliente,
      last_name: user.apellido_cliente,
      phone: user.telefono_cliente,
      address: user.direccion_cliente,
      nationality: user.nacionalidad
    })
  })
)

export default router