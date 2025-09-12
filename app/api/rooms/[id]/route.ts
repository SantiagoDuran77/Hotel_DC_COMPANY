import { NextResponse } from "next/server"
import { getRoomById } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const room = await getRoomById(params.id)
    return NextResponse.json(room)
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Room not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }
}
