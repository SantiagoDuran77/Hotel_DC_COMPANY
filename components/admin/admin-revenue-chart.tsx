"use client"

import { useEffect, useState } from "react"

export function AdminRevenueChart() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-[300px] w-full">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Cargando gráfico de ingresos...
        </div>
      </div>
    )
  }

  // En un entorno real, aquí se renderizaría un gráfico real con datos
  // Para este prototipo, simulamos un gráfico con HTML/CSS
  return (
    <div className="h-[300px] w-full">
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-end gap-2 pb-4">
          <div className="w-1/12 bg-primary h-[30%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[45%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[60%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[40%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[55%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[70%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[80%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[65%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[90%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[75%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[85%] rounded-t-md"></div>
          <div className="w-1/12 bg-primary h-[95%] rounded-t-md"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
          <div>Ene</div>
          <div>Feb</div>
          <div>Mar</div>
          <div>Abr</div>
          <div>May</div>
          <div>Jun</div>
          <div>Jul</div>
          <div>Ago</div>
          <div>Sep</div>
          <div>Oct</div>
          <div>Nov</div>
          <div>Dic</div>
        </div>
      </div>
    </div>
  )
}
