import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/ProductsSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ProductsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}