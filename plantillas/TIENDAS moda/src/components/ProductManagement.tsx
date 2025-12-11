import { useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { toast } from "sonner@2.0.3";
import { formatPrice } from "../utils/formatPrice";
import type { Product } from "./ProductCard";

interface ProductManagementProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export function ProductManagement({
  products,
  onUpdateProducts,
}: ProductManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    inStock: true,
    discount: "",
  });

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        inStock: product.inStock,
        discount: product.discount?.toString() || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        category: "",
        image: "",
        inStock: true,
        discount: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1708363390847-b4af54f45273?w=400",
      inStock: formData.inStock,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
    };

    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? productData : p
      );
      onUpdateProducts(updatedProducts);
      toast.success("Producto actualizado exitosamente");
    } else {
      onUpdateProducts([...products, productData]);
      toast.success("Producto agregado exitosamente");
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    onUpdateProducts(updatedProducts);
    toast.success("Producto eliminado");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestión de Productos</CardTitle>
          <Button onClick={() => openDialog()} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay productos para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.discount ? `${product.discount}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <span className="text-secondary">Disponible</span>
                      ) : (
                        <span className="text-muted-foreground">Agotado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Vestido elegante"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Vestidos"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (CLP) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="29990"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Descuento (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">En Stock</Label>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, inStock: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}