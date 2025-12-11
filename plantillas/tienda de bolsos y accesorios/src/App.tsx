import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  ShoppingBag,
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Heart,
} from "lucide-react";
import bolsoNaranja from "figma:asset/9848878e391bb9b5ee64ec40f2055ae997614257.png";
import bolsoVerde from "figma:asset/a11083f13b8aeb97e2b9ce435c847c672029bf31.png";
import bolsoRosa from "figma:asset/5f864ec0b5bc6d16a8dd6430a4ae9bcc2d692f52.png";
import bolsoAzulVaquero from "figma:asset/4b8b4098d951604224d4d4f33053400d9acd03b8.png";
import coleccionBolsos from "figma:asset/4b0d4dfe20851353443d3475134282da8ef97a33.png";
import bolsoAzulIndividual from "figma:asset/eb913e358a38abe24728d74cd54cd297247ddc96.png";

export default function App() {
  const featuredProducts = [
    {
      id: 1,
      name: "Bolso Elegante Naranja con Cadena de Perlas",
      price: "$85.000 COP",
      originalPrice: "$95.000 COP",
      image: bolsoNaranja,
      rating: 4.8,
      isNew: false,
      isSale: true,
    },
    {
      id: 2,
      name: "Bolso Verde Tejido con Cadena Metálica",
      price: "$75.000 COP",
      image: bolsoVerde,
      rating: 4.9,
      isNew: true,
      isSale: false,
    },
    {
      id: 3,
      name: "Bolso Rosa Tejido con Asa Trenzada",
      price: "$75.000 COP",
      image: bolsoRosa,
      rating: 4.7,
      isNew: false,
      isSale: false,
    },
    {
      id: 4,
      name: "Bolso de nailon Azul Vaquero",
      price: "$75.000 COP",
      originalPrice: "$85.000 COP",
      image: bolsoAzulVaquero,
      rating: 4.6,
      isNew: false,
      isSale: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">
              TaRa Bag Store
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#inicio"
              className="hover:text-primary transition-colors"
            >
              Inicio
            </a>
            <a
              href="#productos"
              className="hover:text-primary transition-colors"
            >
              Productos
            </a>
            <a
              href="#nosotros"
              className="hover:text-primary transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </nav>

          <Button>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Catálogo
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ Nueva Colección Disponible
          </Badge>
          <h1 className="text-4xl md:text-6xl mb-6 max-w-4xl mx-auto">
            Descubre la elegancia en cada
            <span className="text-primary"> bolso</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encuentra el bolso perfecto que complemente tu
            estilo único. Calidad premium, diseños exclusivos y
            la mejor atención al cliente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Ver Colección
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              Sobre Nosotros
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="productos"
        className="py-20 px-4 bg-muted/20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestra selección especial de bolsos más populares
              y nuevos diseños
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    {typeof product.image === "string" ? (
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {product.isNew && (
                        <Badge className="bg-green-500">
                          Nuevo
                        </Badge>
                      )}
                      {product.isSale && (
                        <Badge variant="destructive">
                          Oferta
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.rating})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-semibold">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button className="w-full">
                      Agregar al Carrito
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Todos los Productos
            </Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="nosotros" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6">
                Acerca de Nosotros
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                TaRa Bag Store es un nuevo emprendimiento
                especializado en la creación de bolsos únicos
                con patrones tejidos utilizando hilo nailon
                suave y tela de fantasía. Cada bolso es
                elaborado con dedicación y atención al detalle
                para ofrecerte calidad excepcional.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Lo que nos hace especiales es que el cliente
                puede elegir el color y el estilo de patrón
                tejido de su preferencia. Con anticipación,
                puedes contactarnos para hacerte el bolso
                exactamente a tu gusto, convirtiendo cada pieza
                en una creación personalizada que refleje tu
                estilo único.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Personalizable
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    20+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Patrones Tejidos
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    ∞
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Combinaciones
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={coleccionBolsos}
                alt="Colección de bolsos tejidos TaRa Bag Store"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                src={bolsoAzulIndividual}
                alt="Bolso azul tejido con cadena de perlas"
                className="w-full h-64 object-cover rounded-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              Contactanos
            </h2>
            <p className="text-lg text-muted-foreground">
              Contáctanos por cualquier medio,a nuestro número
              de Whatsapp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="mb-2">Ubicación</h3>
                <p className="text-muted-foreground">
                  Saravena- Arauca
                  <br />
                  <br />
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="mb-2">Teléfono</h3>
                <p className="text-muted-foreground">
                  +57 (320) 800 0396
                  <br />
                  Lun - Vie: 09AM - 05PM
                  <br />
                  Dom: 10AM - 12PM
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="mb-2">Email</h3>
                <p className="text-muted-foreground">
                  erika.restrepo1214@gmail.com
                  <br />
                  <br />
                  Respuesta en 24hrs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  TaRa Bag Store
                </span>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Bolsos tejidos personalizados con hilo nailon
                suave y tela de fantasía.
              </p>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-4">Navegación</h4>
              <div className="space-y-2">
                <a
                  href="#inicio"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Inicio
                </a>
                <a
                  href="#productos"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Productos
                </a>
                <a
                  href="#nosotros"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Nosotros
                </a>
                <a
                  href="#contacto"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Contacto
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4">Categorías</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Bolsos de Mano
                </a>
                <a
                  href="#"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Carteras
                </a>
                <a
                  href="#"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Mochilas
                </a>
                <a
                  href="#"
                  className="block text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Bandoleras
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <p>📍 Saravena_Arauca</p>
                <p>📞 +57 (320) 800-0396</p>
                <p>✉️ erika.restrepo1214@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>
              &copy; 2024 TaRa Bag Store. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}