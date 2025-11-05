import express from "express"
import { executeQuery } from "../config/database.js"

const router = express.Router()

// Crear cliente
router.post("/", async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, nacionalidad } = req.body

    console.log('📝 Creating client:', { nombre_cliente, apellido_cliente, correo_cliente })

    // Verificar si el cliente ya existe
    const existingClient = await executeQuery(
      'SELECT id_cliente FROM cliente WHERE correo_cliente = ?',
      [correo_cliente]
    )

    if (existingClient.length > 0) {
      console.log('✅ Client already exists:', existingClient[0].id_cliente)
      return res.json({ 
        client_id: existingClient[0].id_cliente 
      })
    }

    // Crear nuevo cliente
    const result = await executeQuery(
      `INSERT INTO cliente (nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, nacionalidad) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, nacionalidad || 'Colombiana']
    )

    console.log('✅ New client created:', result.insertId)

    res.json({ 
      client_id: result.insertId 
    })

  } catch (error) {
    console.error('❌ Error creating client:', error)
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    })
  }
})

// AGREGAR ESTA LÍNEA - ES LO QUE FALTABA
export default router