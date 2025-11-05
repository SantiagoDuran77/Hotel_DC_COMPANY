import express from "express"
import { executeQuery } from "../config/database.js"
import { asyncHandler } from "../middleware/errorHandler.js"

const router = express.Router()

// Obtener todos los servicios
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const services = await executeQuery(`
      SELECT * FROM servicio 
      ORDER BY nombre_servicio
    `)

    res.json({
      services: services.map(service => ({
        id: service.id_servicio,
        name: service.nombre_servicio,
        description: service.descripcion_servicio,
        price: service.precio_servicio
      }))
    })
  })
)

export default router