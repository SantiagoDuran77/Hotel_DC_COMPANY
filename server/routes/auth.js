import express from "express"
import { register, login, logout, refreshToken, verifyToken, changePassword } from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"
import { validateLogin, validateRegister } from "../middleware/validation.js"

const router = express.Router()

// Rutas públicas
router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.post("/refresh-token", refreshToken)

// Rutas protegidas
router.post("/logout", authenticateToken, logout)
router.get("/verify", authenticateToken, verifyToken)
router.post("/change-password", authenticateToken, changePassword)

export default router
