"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "tall"
  showThumbnails?: boolean
  autoPlay?: boolean
  interval?: number
}

export default function ImageCarousel({
  images,
  alt,
  className = "",
  aspectRatio = "video",
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Determinar la clase de relación de aspecto
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
    tall: "aspect-[3/4]",
  }[aspectRatio]

  // Función para navegar a la siguiente imagen
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Función para navegar a la imagen anterior
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Configurar reproducción automática si está habilitada
  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      nextImage()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, currentIndex])

  // Si no hay imágenes, mostrar un placeholder
  if (!images.length) {
    return (
      <div className={`relative ${aspectRatioClass} bg-gray-100 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No hay imágenes disponibles
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className={`relative ${aspectRatioClass} overflow-hidden rounded-lg`}>
        {/* Imagen principal */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </div>

        {/* Controles de navegación */}
        <div className="absolute inset-0 flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={prevImage}
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={nextImage}
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Indicador de posición */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 w-6 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Miniaturas */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-2 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                index === currentIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image src={image || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
