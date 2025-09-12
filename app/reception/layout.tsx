"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as authUtils from "@/lib/auth"

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<authUtils.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = authUtils.getCurrentUser()

    if (!user || !authUtils.hasReceptionAccess(user)) {
      router.push("/auth/login")
      return
    }

    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!currentUser || !authUtils.hasReceptionAccess(currentUser)) {
    return null
  }

  return <div>{children}</div>
}
