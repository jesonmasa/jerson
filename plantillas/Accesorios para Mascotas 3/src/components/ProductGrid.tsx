import { ProductCard, Product } from "./ProductCard";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favorites?: Set<string>;
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  onToggleFavorite, 
  favorites = new Set() 
}: ProductGridProps) {
  const dogProducts = products.filter(p => p.category === 'perro');
  const catProducts = products.filter(p => p.category === 'gato');

  const renderProductGrid = (productList: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.has(product.id)}
        />
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para hacer feliz a tu mascota. 
            Productos de alta calidad seleccionados especialmente para ti.
          </p>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="perros">Perros</TabsTrigger>
            <TabsTrigger value="gatos">Gatos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="space-y-8">
            {renderProductGrid(products)}
          </TabsContent>
          
          <TabsContent value="perros" className="space-y-8">
            {renderProductGrid(dogProducts)}
          </TabsContent>
          
          <TabsContent value="gatos" className="space-y-8">
            {renderProductGrid(catProducts)}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver más productos
          </Button>
        </div>
      </div>
    </section>
  );
}