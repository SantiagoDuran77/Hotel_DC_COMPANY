"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as authUtils from "@/lib/auth"
import { EmployeeSidebar } from "@/components/employee/employee-sidebar"
import { EmployeeHeader } from "@/components/employee/employee-header"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const user = authUtils.getCurrentUser()

    if (!user || !authUtils.isEmployee(user)) {
      router.push("/auth/login")
      return
    }

    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de empleado...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || !authUtils.isEmployee(currentUser)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader
        user={currentUser}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      <div className="flex">
        <EmployeeSidebar user={currentUser} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
