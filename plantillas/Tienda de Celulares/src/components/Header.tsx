import { Smartphone, Settings } from 'lucide-react';

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Smartphone className="w-10 h-10 text-blue-600" strokeWidth={2.5} />
              <Settings className="w-5 h-5 text-blue-600 absolute -bottom-1 -right-1" />
            </div>
            <span className="text-2xl text-blue-600">SALVAMOVIL</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="hover:text-blue-600 transition-colors"
            >
              INICIO
            </button>
            <button 
              onClick={() => scrollToSection('celulares')}
              className="hover:text-blue-600 transition-colors"
            >
              CELULARES
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="hover:text-blue-600 transition-colors"
            >
              SERVICIOS
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="hover:text-blue-600 transition-colors"
            >
              CONTACTO
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
