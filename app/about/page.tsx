import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Acerca de Nosotros - Hotel de Lujo",
  description: "Descubra la historia y los valores detrás de nuestro hotel de lujo.",
}

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Acerca de Nosotros</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96">
            <Image src="/placeholder.svg" alt="Hotel de Lujo" fill className="object-cover" />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Historia</h2>
            <p className="text-gray-600 mb-6">
              Fundado en 1985, nuestro Hotel de Lujo ha sido un símbolo de elegancia y hospitalidad durante más de tres
              décadas. Desde nuestros humildes comienzos como un pequeño hotel boutique, hemos crecido para convertirnos
              en uno de los destinos más codiciados para viajeros exigentes de todo el mundo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-600 mb-6">
              Nuestra misión es proporcionar a nuestros huéspedes una experiencia inolvidable, combinando un servicio
              impecable, comodidades de lujo y una atmósfera que refleja la rica cultura de nuestra ubicación. Nos
              esforzamos por superar las expectativas en cada aspecto de la estancia de nuestros huéspedes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestros Valores</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Excelencia en el servicio</li>
              <li>Atención al detalle</li>
              <li>Sostenibilidad y responsabilidad ambiental</li>
              <li>Innovación continua</li>
              <li>Respeto por la diversidad cultural</li>
            </ul>

            <p className="text-gray-600">
              En el Hotel de Lujo, no solo ofrecemos un lugar para alojarse, sino una experiencia que perdurará en la
              memoria de nuestros huéspedes mucho después de su partida. Le invitamos a descubrir el lujo, la comodidad
              y la hospitalidad que definen nuestra marca.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
