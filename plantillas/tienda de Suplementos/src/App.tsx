import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Categories } from "./components/Categories";
import { Benefits } from "./components/Benefits";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}