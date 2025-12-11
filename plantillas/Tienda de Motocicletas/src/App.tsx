import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductsSection from './components/ProductsSection'
import ServicesSection from './components/ServicesSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}