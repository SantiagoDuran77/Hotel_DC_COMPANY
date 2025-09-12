import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AdminRoomsTable } from "@/components/admin/admin-rooms-table"
import { AdminRoomsFilter } from "@/components/admin/admin-rooms-filter"

export default function AdminRoomsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Habitaciones</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar habitación
        </Button>
      </div>

      <AdminRoomsFilter />
      <AdminRoomsTable />
    </div>
  )
}
