import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Registro - Hotel de Lujo",
  description: "Cree una cuenta para gestionar sus reservas y disfrutar de beneficios exclusivos.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
