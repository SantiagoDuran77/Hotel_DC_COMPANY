import jwt from "jsonwebtoken"
import { executeQuery } from "../config/database.js"

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Token de acceso requerido",
        code: "NO_TOKEN",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verificar que el usuario existe y está activo
    const user = await executeQuery(
      "SELECT u.*, c.documento_identidad, c.preferencias FROM usuario u LEFT JOIN cliente c ON u.id_usuario = c.id_usuario WHERE u.id_usuario = ?",
      [decoded.userId],
    )

    if (!user.length) {
      return res.status(401).json({
        error: "Usuario no encontrado",
        code: "USER_NOT_FOUND",
      })
    }

    req.user = {
      id: user[0].id_usuario,
      email: user[0].correo_usuario,
      name: `${user[0].nombre_usuario} ${user[0].apellido_usuario}`,
      role: user[0].tipo_usuario,
      phone: user[0].telefono_usuario,
      documento_identidad: user[0].documento_identidad,
      preferencias: user[0].preferencias,
    }

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token inválido",
        code: "INVALID_TOKEN",
      })
    }

    console.error("Error en autenticación:", error)
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    })
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Usuario no autenticado",
        code: "NOT_AUTHENTICATED",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a este recurso",
        code: "INSUFFICIENT_PERMISSIONS",
        requiredRoles: roles,
        userRole: req.user.role,
      })
    }

    next()
  }
}

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  })

  return { accessToken, refreshToken }
}
