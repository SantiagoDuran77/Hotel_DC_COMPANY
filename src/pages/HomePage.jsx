import HeroSection from "../components/HeroSection"
import FeaturedRooms from "../components/FeaturedRooms"
import FeaturedServices from "../components/FeaturedServices"
import Testimonials from "../components/Testimonials"
import CallToAction from "../components/CallToAction"

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedRooms />
      <FeaturedServices />
      <Testimonials />
      <CallToAction />
    </div>
  )
}

export default HomePage
