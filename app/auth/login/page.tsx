import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Hotel de Lujo",
  description: "Acceda a su cuenta para gestionar sus reservas y preferencias.",
}

export default function LoginPage() {
  return <LoginForm />
}
