"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] md:h-[90vh] lg:h-screen overflow-hidden">
      <Image
        src="/placeholder.svg?height=1200&width=1600"
        alt="Hotel de Lujo"
        fill
        className="object-cover absolute z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">Bienvenido a HOTEL DC COMPANY</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl">
          Disfrute de una experiencia de lujo inolvidable en el corazón de la ciudad. Descubra nuestras habitaciones y
          servicios exclusivos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90"
          >
            <Link href="/rooms">Explorar Habitaciones</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white text-primary px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
          >
            <Link href="/booking/select-room">Seleccionar Habitación</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
