import { AdminDashboardEnhanced } from "@/components/admin/admin-dashboard-enhanced"

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Sistema de gestión hotelera basado en el diagrama de clases Hotel DC Company
        </p>
      </div>
      <AdminDashboardEnhanced />
    </div>
  )
}
