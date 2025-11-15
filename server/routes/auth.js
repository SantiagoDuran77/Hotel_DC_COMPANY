import express from "express"
import { register, login, logout, refreshToken, verifyToken, changePassword } from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"
import { validateLogin, validateRegister } from "../middleware/validation.js"
import db from "../config/database.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

const router = express.Router()

// FUNCIÓN MEJORADA PARA ENVIAR EMAIL
async function sendResetEmail(to, userName, resetLink) {
  try {
    console.log('📧 Configurando transporte de email...');
    console.log('Usuario:', process.env.EMAIL_SERVER_USER);
    
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      throw new Error('Credenciales de email no configuradas en .env');
    }

    // Crear el transporter con configuración mejorada
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Transporter creado, verificando conexión...');

    // Verificar la conexión
    await transporter.verify();
    console.log('✅ Conexión con servidor de email verificada');

    const mailOptions = {
      from: `"Hotel DC Company" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: 'Recuperación de Contraseña - Hotel DC Company',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Hotel DC Company</h1>
            </div>
            <div class="content">
              <h2>Hola ${userName},</h2>
              <p>Has solicitado restablecer tu contraseña para tu cuenta en Hotel DC Company.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Restablecer Contraseña</a>
              </p>
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-size: 12px;">
                ${resetLink}
              </p>
              <p><strong>Este enlace expirará en 1 hora.</strong></p>
              <p>Si no solicitaste este cambio, puedes ignorar este mensaje y tu contraseña permanecerá igual.</p>
            </div>
            <div class="footer">
              <p>Hotel DC Company - Sistema de Gestión Hotelera</p>
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📤 Enviando email a:', to);
    
    // Enviar el email
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente, ID:', result.messageId);
    
    return result;

  } catch (error) {
    console.error('❌ Error en sendResetEmail:', error.message);
    console.log('🔧 Detalles del error:', {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      hasPassword: !!process.env.EMAIL_SERVER_PASSWORD
    });
    throw error;
  }
}

// Rutas públicas
router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.post("/refresh-token", refreshToken)

// Rutas de recuperación de contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    // Verificar si el usuario existe
    const [users] = await db.execute(
      'SELECT * FROM usuario WHERE correo_usuario = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con este email'
      });
    }

    const user = users[0];

    // Obtener información del cliente/empleado
    let userInfo = {};
    let userName = 'Usuario';
    
    if (user.usuario_acceso === 'Cliente') {
      const [clients] = await db.execute(
        'SELECT * FROM cliente WHERE correo_cliente = ?',
        [email]
      );
      if (clients.length > 0) {
        userInfo = clients[0];
        userName = `${userInfo.nombre_cliente || ''} ${userInfo.apellido_cliente || ''}`.trim() || 'Cliente';
      }
    } else {
      const [employees] = await db.execute(
        'SELECT * FROM empleado WHERE correo_empleado = ?',
        [email]
      );
      if (employees.length > 0) {
        userInfo = employees[0];
        userName = `${userInfo.nombre_empleado || ''} ${userInfo.apellido_empleado || ''}`.trim() || 'Empleado';
      }
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la tabla usuario
    await db.execute(
      'UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE correo_usuario = ?',
      [resetToken, tokenExpires, email]
    );

    // Construir enlace de reset
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    console.log('📧 Preparando envío de email...');
    console.log('Para:', email);
    console.log('Nombre:', userName);
    console.log('Enlace:', resetLink);

    // Verificar si tenemos credenciales de email configuradas
    if (!process.env.EMAIL_SERVER_PASSWORD || process.env.EMAIL_SERVER_PASSWORD === 'tu_contraseña_de_aplicación_correcta_aqui') {
      console.log('⚠️  Credenciales de email no configuradas correctamente');
      return res.json({
        success: true,
        message: 'Enlace de recuperación generado. Revisa la consola del servidor para el enlace.',
        debug: { resetLink }
      });
    }

    try {
      // ENVÍO REAL DE EMAIL
      await sendResetEmail(email, userName, resetLink);
      
      res.json({
        success: true,
        message: 'Se ha enviado un enlace de recuperación a tu email'
      });

    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError.message);
      
      // Aún así devolvemos el enlace para desarrollo
      res.json({
        success: true,
        message: 'Error enviando email. Revisa la consola del servidor para el enlace de recuperación.',
        debug: process.env.NODE_ENV === 'development' ? { resetLink, error: emailError.message } : undefined
      });
    }

  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar token en la tabla usuario
    const [users] = await db.execute(
      'SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    const user = users[0];

    // Actualizar contraseña (solo primeros 4 caracteres)
    const passwordToStore = newPassword.substring(0, 4);
    
    // Actualizar contraseña y limpiar token
    await db.execute(
      'UPDATE usuario SET contraseña_usuario = ?, reset_token = NULL, reset_token_expires = NULL WHERE correo_usuario = ?',
      [passwordToStore, user.correo_usuario]
    );

    console.log('🔄 Contraseña actualizada para:', user.correo_usuario);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Rutas protegidas
router.post("/logout", authenticateToken, logout)
router.get("/verify", authenticateToken, verifyToken)
router.post("/change-password", authenticateToken, changePassword)

export default router