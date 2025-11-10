// app/admin/layout.tsx
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { authUtils } from "@/lib/utils/authUtils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const user = authUtils.getCurrentUser()
      console.log('🔍 Admin layout - Current user:', user)

      if (!user) {
        console.log('❌ No user found, redirecting to login')
        router.push("/auth/login")
        return
      }

      if (!authUtils.hasAdminAccess(user)) {
        console.log('❌ User does not have admin access, redirecting to client dashboard')
        router.push("/dashboard")
        return
      }

      setCurrentUser(user)
      setIsLoading(false)
    }

    // Pequeño delay para asegurar que localStorage esté actualizado
    setTimeout(checkAuth, 100)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso de administrador...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={currentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}