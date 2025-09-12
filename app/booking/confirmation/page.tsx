import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  Check,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  Phone,
  MapPin,
  Shield,
  Download,
  ArrowLeft,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Confirmación de Reserva - HOTEL DC COMPANY",
  description: "Su reserva ha sido confirmada. Gracias por elegir nuestro hotel.",
}

export default function ConfirmationPage({ searchParams }: { searchParams: { id?: string } }) {
  const bookingId = searchParams.id || "RES123456"

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary/10 p-8 text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
            <p className="text-lg text-gray-600">
              Su reserva ha sido procesada con éxito. Hemos enviado un correo electrónico con los detalles de su
              reserva.
            </p>
            <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-gray-500 mr-2">Número de Reserva:</span>
              <span className="font-bold text-primary">{bookingId}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Detalles de la Reserva</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Información de Estancia</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Fechas</p>
                        <p className="text-gray-600">15 Ene 2024 - 20 Ene 2024</p>
                        <p className="text-gray-600">5 noches</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Huéspedes</p>
                        <p className="text-gray-600">2 adultos</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-gray-600">HOTEL DC COMPANY</p>
                        <p className="text-gray-600">123 Luxury Avenue, City Center</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Habitación Reservada</h3>
                  <div className="flex items-start">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden mr-3">
                      <Image src="/placeholder.svg" alt="Suite Ejecutiva" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">Suite Ejecutiva</p>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Badge variant="outline" className="mr-2">
                          King Size
                        </Badge>
                        <Badge variant="outline">Vista Ciudad</Badge>
                      </div>
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">$1,745.00</span> total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Información Importante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Horarios</p>
                      <p className="text-gray-600">Check-in: a partir de las 15:00</p>
                      <p className="text-gray-600">Check-out: hasta las 12:00</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Política de Cancelación</p>
                      <p className="text-gray-600">Cancelación gratuita hasta 48 horas antes de la fecha de llegada.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Documentación Necesaria</p>
                      <p className="text-gray-600">
                        Todos los huéspedes deben presentar un documento de identidad válido al momento del check-in.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Seguridad</p>
                      <p className="text-gray-600">
                        Su reserva está protegida por nuestra política de seguridad y privacidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">¿Necesita Ayuda?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <p>reservas@hoteldccompany.com</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Descargar Confirmación
              </Button>
              <Link href="/dashboard">
                <Button>Ver Mis Reservas</Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver a la página principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
