import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AdminEmployeesTable } from "@/components/admin/admin-employees-table"

export default function AdminEmployeesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar empleado
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Buscar empleados..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
      </div>

      <AdminEmployeesTable />
    </div>
  )
}
