import type { Metadata } from "next"
import BookingSteps from "@/components/booking-steps"

export const metadata: Metadata = {
  title: "Complete Your Booking - Luxury Hotel",
  description: "Complete your reservation at our luxury hotel.",
}

export default function BookingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>
        <BookingSteps />
      </div>
    </div>
  )
}
