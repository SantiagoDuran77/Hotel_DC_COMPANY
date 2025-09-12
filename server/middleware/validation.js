import { body, param, query, validationResult } from "express-validator"

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Errores de validación",
      code: "VALIDATION_ERROR",
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    })
  }
  next()
}

// Validaciones para autenticación
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email debe ser válido"),
  body("password").isLength({ min: 4 }).withMessage("Contraseña debe tener al menos 4 caracteres"),
  handleValidationErrors,
]

export const validateRegister = [
  body("nombre_usuario").trim().isLength({ min: 2, max: 50 }).withMessage("Nombre debe tener entre 2 y 50 caracteres"),
  body("apellido_usuario")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido debe tener entre 2 y 50 caracteres"),
  body("correo_usuario").isEmail().normalizeEmail().withMessage("Email debe ser válido"),
  body("telefono_usuario").optional().isMobilePhone("es-ES").withMessage("Teléfono debe ser válido"),
  body("contrasena_usuario").isLength({ min: 4, max: 8 }).withMessage("Contraseña debe tener entre 4 y 8 caracteres"),
  body("direccion_usuario").optional().isLength({ max: 100 }).withMessage("Dirección no puede exceder 100 caracteres"),
  handleValidationErrors,
]

// Validaciones para reservas
export const validateReservation = [
  body("fecha_llegada").isISO8601().toDate().withMessage("Fecha de llegada debe ser válida"),
  body("fecha_salida").isISO8601().toDate().withMessage("Fecha de salida debe ser válida"),
  body("numero_huespedes").isInt({ min: 1, max: 10 }).withMessage("Número de huéspedes debe ser entre 1 y 10"),
  body("observaciones").optional().isLength({ max: 500 }).withMessage("Observaciones no pueden exceder 500 caracteres"),
  handleValidationErrors,
]

// Validaciones para habitaciones
export const validateRoom = [
  body("numero_habitacion").trim().isLength({ min: 1, max: 10 }).withMessage("Número de habitación es requerido"),
  body("tipo_habitacion")
    .isIn(["simple", "doble", "suite", "deluxe"])
    .withMessage("Tipo de habitación debe ser: simple, doble, suite o deluxe"),
  body("costo_habitacion").isFloat({ min: 0 }).withMessage("Costo debe ser un número positivo"),
  body("capacidad_personas").isInt({ min: 1, max: 10 }).withMessage("Capacidad debe ser entre 1 y 10 personas"),
  handleValidationErrors,
]

// Validaciones para servicios
export const validateService = [
  body("nombre_servicio")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre del servicio debe tener entre 2 y 50 caracteres"),
  body("precio_servicio").isFloat({ min: 0 }).withMessage("Precio debe ser un número positivo"),
  body("categoria").optional().isLength({ max: 50 }).withMessage("Categoría no puede exceder 50 caracteres"),
  handleValidationErrors,
]

// Validaciones para parámetros de URL
export const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID debe ser un número entero positivo"),
  handleValidationErrors,
]

// Validaciones para queries de búsqueda
export const validateSearch = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser un número positivo"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Límite debe ser entre 1 y 100"),
  query("search").optional().trim().isLength({ max: 100 }).withMessage("Búsqueda no puede exceder 100 caracteres"),
  handleValidationErrors,
]
