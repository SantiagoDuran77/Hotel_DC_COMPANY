"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReservationsList from "./reservations-list"
import UpcomingReservations from "./upcoming-reservations"
import RecentActivity from "./recent-activity"

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="upcoming">Próximas Reservas</TabsTrigger>
        <TabsTrigger value="all">Todas las Reservas</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Reservas Activas</h3>
            <p className="text-3xl font-bold text-primary">2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Puntos de Fidelidad</h3>
            <p className="text-3xl font-bold text-primary">1,250</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Reservas Totales</h3>
            <p className="text-3xl font-bold text-primary">8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Próximas Reservas</h3>
            <UpcomingReservations limit={3} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <RecentActivity />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="upcoming">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Próximas Reservas</h2>
          <UpcomingReservations />
        </div>
      </TabsContent>

      <TabsContent value="all">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Todas las Reservas</h2>
          <ReservationsList />
        </div>
      </TabsContent>
    </Tabs>
  )
}
