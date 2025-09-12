import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" // Import jwt to fix the undeclared variable error
import { executeQuery, executeTransaction } from "../config/database.js"
import { generateTokens } from "../middleware/auth.js"
import { asyncHandler } from "../middleware/errorHandler.js"

// Registro de usuario
export const register = asyncHandler(async (req, res) => {
  const {
    nombre_usuario,
    apellido_usuario,
    correo_usuario,
    telefono_usuario,
    direccion_usuario,
    contrasena_usuario,
    tipo_usuario = "cliente",
    documento_identidad,
    fecha_nacimiento,
    nacionalidad,
    preferencias,
  } = req.body

  // Verificar si el usuario ya existe
  const existingUser = await executeQuery(
    "SELECT id_usuario FROM usuario WHERE correo_usuario = ? OR nombre_usuario = ?",
    [correo_usuario, nombre_usuario],
  )

  if (existingUser.length > 0) {
    return res.status(409).json({
      error: "El usuario ya existe con ese email o nombre de usuario",
      code: "USER_EXISTS",
    })
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(contrasena_usuario, Number.parseInt(process.env.BCRYPT_ROUNDS))

  // Crear transacción para insertar usuario y cliente
  const queries = [
    {
      query: `INSERT INTO usuario (nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, 
               direccion_usuario, contrasena_usuario, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [
        nombre_usuario,
        apellido_usuario,
        correo_usuario,
        telefono_usuario,
        direccion_usuario,
        hashedPassword,
        tipo_usuario,
      ],
    },
  ]

  const results = await executeTransaction(queries)
  const userId = results[0].insertId

  // Si es cliente, insertar en tabla cliente
  if (tipo_usuario === "cliente" && documento_identidad) {
    await executeQuery(
      `INSERT INTO cliente (id_usuario, documento_identidad, fecha_nacimiento, 
       nacionalidad, preferencias) VALUES (?, ?, ?, ?, ?)`,
      [userId, documento_identidad, fecha_nacimiento, nacionalidad, preferencias],
    )
  }

  // Generar tokens
  const { accessToken, refreshToken } = generateTokens(userId)

  // Obtener datos completos del usuario
  const userData = await executeQuery(
    `SELECT u.id_usuario, u.nombre_usuario, u.apellido_usuario, u.correo_usuario, 
     u.telefono_usuario, u.tipo_usuario, c.documento_identidad, c.preferencias
     FROM usuario u LEFT JOIN cliente c ON u.id_usuario = c.id_usuario 
     WHERE u.id_usuario = ?`,
    [userId],
  )

  const user = userData[0]

  res.status(201).json({
    message: "Usuario registrado exitosamente",
    user: {
      id: user.id_usuario,
      name: `${user.nombre_usuario} ${user.apellido_usuario}`,
      email: user.correo_usuario,
      role: user.tipo_usuario,
      phone: user.telefono_usuario,
      documento_identidad: user.documento_identidad,
      preferencias: user.preferencias,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  })
})

// Inicio de sesión
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Buscar usuario por email
  const users = await executeQuery(
    `SELECT u.*, c.documento_identidad, c.preferencias, e.cargo, e.departamento
     FROM usuario u 
     LEFT JOIN cliente c ON u.id_usuario = c.id_usuario 
     LEFT JOIN empleado e ON u.id_usuario = e.id_usuario
     WHERE u.correo_usuario = ?`,
    [email],
  )

  if (!users.length) {
    return res.status(401).json({
      error: "Credenciales inválidas",
      code: "INVALID_CREDENTIALS",
    })
  }

  const user = users[0]

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.contrasena_usuario)
  if (!isValidPassword) {
    return res.status(401).json({
      error: "Credenciales inválidas",
      code: "INVALID_CREDENTIALS",
    })
  }

  // Generar tokens
  const { accessToken, refreshToken } = generateTokens(user.id_usuario)

  // Actualizar último acceso
  await executeQuery("UPDATE usuario SET updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ?", [user.id_usuario])

  res.json({
    message: "Inicio de sesión exitoso",
    user: {
      id: user.id_usuario,
      name: `${user.nombre_usuario} ${user.apellido_usuario}`,
      email: user.correo_usuario,
      role: user.tipo_usuario,
      phone: user.telefono_usuario,
      documento_identidad: user.documento_identidad,
      preferencias: user.preferencias,
      department: user.departamento,
      cargo: user.cargo,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  })
})

// Cerrar sesión
export const logout = asyncHandler(async (req, res) => {
  // En una implementación completa, aquí invalidarías el token en una blacklist
  res.json({
    message: "Sesión cerrada exitosamente",
  })
})

// Refrescar token
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token requerido",
      code: "NO_REFRESH_TOKEN",
    })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId)

    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    })
  } catch (error) {
    res.status(401).json({
      error: "Refresh token inválido",
      code: "INVALID_REFRESH_TOKEN",
    })
  }
})

// Verificar token
export const verifyToken = asyncHandler(async (req, res) => {
  res.json({
    message: "Token válido",
    user: req.user,
  })
})

// Cambiar contraseña
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user.id

  // Obtener contraseña actual
  const users = await executeQuery("SELECT contrasena_usuario FROM usuario WHERE id_usuario = ?", [userId])

  if (!users.length) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      code: "USER_NOT_FOUND",
    })
  }

  // Verificar contraseña actual
  const isValidPassword = await bcrypt.compare(currentPassword, users[0].contrasena_usuario)
  if (!isValidPassword) {
    return res.status(400).json({
      error: "Contraseña actual incorrecta",
      code: "INVALID_CURRENT_PASSWORD",
    })
  }

  // Encriptar nueva contraseña
  const hashedNewPassword = await bcrypt.hash(newPassword, Number.parseInt(process.env.BCRYPT_ROUNDS))

  // Actualizar contraseña
  await executeQuery("UPDATE usuario SET contrasena_usuario = ?, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ?", [
    hashedNewPassword,
    userId,
  ])

  res.json({
    message: "Contraseña actualizada exitosamente",
  })
})
