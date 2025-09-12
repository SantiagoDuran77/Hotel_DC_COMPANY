import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AdminBookingsTable } from "@/components/admin/admin-bookings-table"
import { AdminBookingsFilter } from "@/components/admin/admin-bookings-filter"

export default function AdminBookingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva reserva
        </Button>
      </div>

      <AdminBookingsFilter />
      <AdminBookingsTable />
    </div>
  )
}
