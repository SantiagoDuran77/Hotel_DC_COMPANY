import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"

// Importar rutas
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import roomRoutes from "./routes/rooms.js"
import reservationRoutes from "./routes/reservations.js"
import serviceRoutes from "./routes/services.js"
import paymentRoutes from "./routes/payments.js"
import dashboardRoutes from "./routes/dashboard.js"
import clientRoutes from "./routes/clients.js"

// Importar middleware
import { errorHandler } from "./middleware/errorHandler.js"
import { authenticateToken } from "./middleware/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Configuración de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// Middleware básico
app.use(compression())
app.use(morgan("combined"))
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Rutas públicas
app.use("/api/auth", authRoutes)

// 🔓 ACCESO TEMPORAL SIN AUTENTICACIÓN - COMENTA LA SIGUIENTE LÍNEA:
// app.use("/api", authenticateToken)

// 🎯 RUTAS PROTEGIDAS PERO TEMPORALMENTE SIN AUTENTICACIÓN
app.use("/api/users", userRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/clients", clientRoutes)

// Ruta de salud del servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Ruta específica para users (por si acaso)
app.get("/api/users/test", (req, res) => {
  res.json({
    message: "Ruta de usuarios funcionando",
    timestamp: new Date().toISOString()
  })
})

// Middleware de manejo de errores
app.use(errorHandler)

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "/api/health",
      "/api/users",
      "/api/rooms", 
      "/api/services",
      "/api/clients",
      "/api/reservations"
    ]
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`)
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`)
  console.log(`🔓 MODO: Autenticación temporalmente desactivada`)
  console.log(`📋 Rutas disponibles:`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/users`)
  console.log(`   GET  /api/users/test`)
  console.log(`   GET  /api/rooms`) // ✅ AQUÍ ESTABA FALTANDO ESTA LÍNEA
  console.log(`   GET  /api/services`)
  console.log(`   POST /api/clients`)
  console.log(`   POST /api/reservations`)
})

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error("Error no manejado:", err)
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("Excepción no capturada:", err)
  process.exit(1)
})