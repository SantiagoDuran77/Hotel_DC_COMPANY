"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, User, Shield, UserCog, LogIn } from "lucide-react"
import Link from "next/link"

export default function Instructions() {
  return (
    <div className="mb-8 space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Sistema de Demostración</AlertTitle>
        <AlertDescription>
          Este es un sistema de demostración del Hotel DC Company. Use las credenciales a continuación para probar las
          diferentes funcionalidades.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Administrador
            </CardTitle>
            <CardDescription>Acceso completo al sistema de gestión</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Correo:</p>
              <Badge variant="outline" className="font-mono">
                admin@hotel.com
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Contraseña:</p>
              <Badge variant="outline">Cualquier contraseña</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              • Gestión de habitaciones
              <br />• Administración de reservas
              <br />• Control de usuarios
              <br />• Reportes y análisis
              <br />• Configuración del sistema
            </div>
            <Button asChild size="sm" className="w-full">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-blue-600" />
              Empleado
            </CardTitle>
            <CardDescription>Acceso limitado para personal del hotel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Correo:</p>
              <Badge variant="outline" className="font-mono">
                empleado@hotel.com
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Contraseña:</p>
              <Badge variant="outline">Cualquier contraseña</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              • Ver reservas
              <br />• Consultar habitaciones
              <br />• Gestión básica
              <br />• Sin permisos de eliminación
            </div>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Cliente
            </CardTitle>
            <CardDescription>Experiencia de usuario final</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Correo:</p>
              <Badge variant="outline" className="font-mono">
                cliente@ejemplo.com
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Contraseña:</p>
              <Badge variant="outline">Cualquier contraseña</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              • Realizar reservas
              <br />• Ver habitaciones disponibles
              <br />• Gestionar perfil
              <br />• Historial de reservas
            </div>
            <Button asChild size="sm" variant="secondary" className="w-full">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
