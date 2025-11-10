import express from "express"
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  getRoomAvailability
} from "../controllers/roomController.js"
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"
import { validateRoom, validateId, validateSearch } from "../middleware/validation.js"

const router = express.Router()

// 🔓 RUTAS PÚBLICAS (SIN AUTENTICACIÓN - para que los clientes puedan ver habitaciones)
router.get("/", validateSearch, getRooms)
router.get("/availability", checkAvailability)
router.get("/availability/new", getRoomAvailability)
router.get("/:id", validateId, getRoomById)

// 🔐 RUTAS PROTEGIDAS SOLO PARA EMPLEADOS/ADMIN (CON AUTENTICACIÓN)
router.post("/", authenticateToken, authorizeRoles("admin", "empleado"), validateRoom, createRoom)
router.put("/:id", authenticateToken, authorizeRoles("admin", "empleado"), validateId, validateRoom, updateRoom)
router.delete("/:id", authenticateToken, authorizeRoles("admin", "empleado"), validateId, deleteRoom)

export default router