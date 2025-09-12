"use client"

import { useState } from "react"
import { useToast } from "../contexts/ToastContext"

const BookingPage = () => {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "",
    name: "",
    email: "",
    phone: "",
  })
  const { toast } = useToast()

  const roomTypes = [
    { id: "standard", name: "Habitación Estándar", price: 120 },
    { id: "deluxe", name: "Habitación Deluxe", price: 200 },
    { id: "suite", name: "Suite Presidencial", price: 500 },
  ]

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate booking submission
    toast.success("Reserva realizada correctamente. Te contactaremos para confirmar.")
    setBookingData({
      checkIn: "",
      checkOut: "",
      guests: 1,
      roomType: "",
      name: "",
      email: "",
      phone: "",
    })
  }

  const selectedRoom = roomTypes.find((room) => room.id === bookingData.roomType)

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Reservar Habitación</h1>
          <p className="mt-4 text-lg text-gray-600">Completa el formulario para realizar tu reserva</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Entrada
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Salida
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Huéspedes
                </label>
                <select id="guests" name="guests" value={bookingData.guests} onChange={handleChange} className="input">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Huésped" : "Huéspedes"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Habitación
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={bookingData.roomType}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Selecciona una habitación</option>
                  {roomTypes.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - ${room.price}/noche
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            {selectedRoom && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Resumen de la Reserva</h3>
                <p className="text-blue-800">
                  Habitación: {selectedRoom.name} - ${selectedRoom.price}/noche
                </p>
                <p className="text-blue-800">Huéspedes: {bookingData.guests}</p>
              </div>
            )}

            <button type="submit" className="w-full btn btn-primary py-3 text-lg">
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
