"use client"

import { useEffect, useState } from "react"

export function AdminOccupancyChart() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[300px] w-full">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Cargando gráfico de ocupación...
        </div>
      </div>
    )
  }

  // En un entorno real, aquí se renderizaría un gráfico real con datos
  // Para este prototipo, simulamos un gráfico con HTML/CSS
  return (
    <div className="h-[300px] w-full">
      <div className="flex h-full flex-col">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="flex items-center">
            <div className="w-24 text-sm">Estándar</div>
            <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "85%" }}></div>
            </div>
            <div className="w-12 text-sm text-right">85%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Deluxe</div>
            <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "92%" }}></div>
            </div>
            <div className="w-12 text-sm text-right">92%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Premium</div>
            <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "78%" }}></div>
            </div>
            <div className="w-12 text-sm text-right">78%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Suite</div>
            <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "65%" }}></div>
            </div>
            <div className="w-12 text-sm text-right">65%</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 text-sm">Presidencial</div>
            <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "50%" }}></div>
            </div>
            <div className="w-12 text-sm text-right">50%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
