import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">S</span>
              </div>
              <span className="font-bold text-xl">SuppleFit</span>
            </div>
            <p className="text-sm opacity-90">
              Sua loja especializada em suplementos esportivos de alta qualidade. 
              Ajudamos você a alcançar seus objetivos na academia.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Links Rápidos</h3>
            <div className="space-y-2 text-sm">
              <a href="#produtos" className="block hover:underline opacity-90 hover:opacity-100">
                Produtos
              </a>
              <a href="#categorias" className="block hover:underline opacity-90 hover:opacity-100">
                Categorias
              </a>
              <a href="#sobre" className="block hover:underline opacity-90 hover:opacity-100">
                Sobre Nós
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Blog
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                FAQ
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Suporte</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Central de Ajuda
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Política de Privacidade
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Termos de Uso
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Trocas e Devoluções
              </a>
              <a href="#" className="block hover:underline opacity-90 hover:opacity-100">
                Rastreamento
              </a>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@supplefit.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Newsletter</h4>
              <p className="text-xs opacity-90">Receba ofertas exclusivas</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Seu e-mail" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button size="sm" variant="secondary">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2024 SuppleFit. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}