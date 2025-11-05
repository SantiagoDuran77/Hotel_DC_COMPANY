import express from "express"
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  getRoomAvailability // ← AGREGAR ESTA IMPORTACIÓN
} from "../controllers/roomController.js"
import { authorizeRoles } from "../middleware/auth.js"
import { validateRoom, validateId, validateSearch } from "../middleware/validation.js"

const router = express.Router()

// Rutas públicas (disponibles para todos los usuarios autenticados)
router.get("/", validateSearch, getRooms)
router.get("/availability", checkAvailability)
router.get("/availability/new", getRoomAvailability) // ← AGREGAR ESTA RUTA NUEVA
router.get("/:id", validateId, getRoomById)

// Rutas solo para administradores
router.post("/", authorizeRoles("admin"), validateRoom, createRoom)
router.put("/:id", authorizeRoles("admin"), validateId, validateRoom, updateRoom)
router.delete("/:id", authorizeRoles("admin"), validateId, deleteRoom)

export default router