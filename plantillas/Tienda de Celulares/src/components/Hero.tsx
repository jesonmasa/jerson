import heroPhone from 'figma:asset/5f5f8342cc743a01c3cb0cc9acf438afcb983917.png';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl">
              Venta y<br />
              reparación<br />
              de celulares
            </h1>
            <p className="text-xl text-gray-600 max-w-md">
              Compra los últimos modelos de celulares y repara el tuyo aquí
            </p>
            <button 
              onClick={() => scrollToSection('celulares')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              VER CELULARES
            </button>
          </div>
          
          <div className="flex-1 flex justify-center">
            <img 
              src={heroPhone} 
              alt="Celular" 
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
