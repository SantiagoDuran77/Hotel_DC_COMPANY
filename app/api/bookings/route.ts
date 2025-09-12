import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["roomId", "checkIn", "checkOut", "guests", "name", "email", "phone"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return new NextResponse(JSON.stringify({ error: `Campo requerido faltante: ${field}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    // En una aplicación real, aquí guardarías la reserva en una base de datos
    // Para este ejemplo, solo devolveremos una respuesta de éxito con un ID de reserva

    return NextResponse.json({
      success: true,
      bookingId: "BK" + Math.floor(100000 + Math.random() * 900000),
      ...body,
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Error al procesar la reserva" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
