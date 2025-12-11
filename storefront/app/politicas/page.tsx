'use client';
import React, { useEffect, useState } from 'react';

export default function Politicas() {
    // Para esta página estática global, usaremos valores por defecto del Marketplace
    const config = {
        storeName: 'Constructor Marketplace',
        contactEmail: 'soporte@constructor.com',
        logoUrl: '' // Opcional
    };
    const [loading, setLoading] = useState(false);

    // Si se necesitara configuración dinámica en el futuro, usar /api/marketplace/config
    /*
    useEffect(() => {
       // ...
    }, []);
    */

    const storeName = config?.storeName || 'Nuestra Tienda';
    const contactEmail = config?.contactEmail || 'contacto@tienda.com';
    const primaryColor = '#1f2937'; // Default to dark gray/black implies neutrality, or use config color if available

    if (loading) {
        return <div className="p-10 text-center">Cargando políticas...</div>;
    }

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            color: '#1f2937',
'use client';
import React, { useEffect, useState } from 'react';

export default function Politicas() {
    // Para esta página estática global, usaremos valores por defecto del Marketplace
    const config = {
        storeName: 'Constructor Marketplace',
        contactEmail: 'soporte@constructor.com',
        logoUrl: '' // Opcional
    };
    const [loading, setLoading] = useState(false);

    // Si se necesitara configuración dinámica en el futuro, usar /api/marketplace/config
    /*
    useEffect(() => {
       // ...
    }, []);
    */

    const storeName = config?.storeName || 'Nuestra Tienda';
    const contactEmail = config?.contactEmail || 'contacto@tienda.com';
    const primaryColor = '#1f2937'; // Default to dark gray/black implies neutrality, or use config color if available

    if (loading) {
        return <div className="p-10 text-center">Cargando políticas...</div>;
    }

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            color: '#1f2937',
            backgroundColor: '#ffffff',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <header style={{
                background: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '16px',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        {config?.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ fontSize: '24px' }}>🏪</span>
                        )}
                        <h1 style={{ fontSize: '24px', color: '#111827', margin: 0, fontWeight: 700 }}>{storeName}</h1>
                    </a>
                    <a href="/" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600 }}>← Volver al inicio</a>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '32px' }}>
                    Políticas de Privacidad
                </h1>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        1. Información que Recopilamos
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '12px' }}>
                        En <strong>{storeName}</strong>, recopilamos información que nos proporcionas directamente cuando realizas una compra,
                        te registras en nuestro sitio o te comunicas con nosotros. Esta información puede incluir:
                    </p>
                    <ul style={{ color: '#4b5563', lineHeight: 1.8, paddingLeft: '24px' }}>
                        <li>Nombre y apellidos</li>
                        <li>Dirección de correo electrónico</li>
                        <li>Número de teléfono</li>
                        <li>Dirección de envío</li>
                        <li>Información de pago</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        2. Uso de la Información
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                        Utilizamos la información recopilada para procesar tus pedidos, mejorar nuestros servicios,
                        enviarte actualizaciones sobre tu pedido y comunicarnos contigo sobre promociones y novedades.
                    </p>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        3. Protección de Datos
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales
                        contra acceso no autorizado, alteración, divulgación o destrucción.
                    </p>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        4. Cookies
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                        Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio
                        y personalizar el contenido. Puedes configurar tu navegador para rechazar cookies.
                    </p>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        5. Derechos del Usuario
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                        Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales.
                        Para ejercer estos derechos, contáctanos a través de nuestro correo electrónico.
                    </p>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                        6. Contacto
                    </h2>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                        Si tienes preguntas sobre estas políticas, puedes contactarnos en:
                    </p>
                    <p style={{ color: '#111827', fontWeight: 600, marginTop: '12px' }}>
                        {contactEmail}
                    </p>
                </section>

                <div style={{
                    marginTop: '48px',
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Última actualización: Diciembre 2024
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: '#1f2937', color: 'white', padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af' }}>© {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
