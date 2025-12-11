// OtherThemes.tsx - All 18 additional themes using UnifiedTheme with real color schemes
// Colors match the backend config.js themes

'use client';
import UnifiedTheme from './UnifiedTheme';

import { themeConfigs } from '../../lib/themeConfigs';

// Export individual themed components
export const TiendaAccesoriosTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-accesorios']} themeName={themeConfigs['tienda-accesorios'].name} />
);

export const TiendaOnlineAccesoriosTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-online-accesorios']} themeName={themeConfigs['tienda-online-accesorios'].name} />
);

export const TiendaCacaoTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-cacao']} themeName={themeConfigs['tienda-cacao'].name} />
);

export const TiendaCalzado2Theme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-calzado-2']} themeName={themeConfigs['tienda-calzado-2'].name} layoutVariant={themeConfigs['tienda-calzado-2'].layoutVariant} />
);

export const TiendaCelularesTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-celulares']} themeName={themeConfigs['tienda-celulares'].name} />
);

export const TiendaElectronicaTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-electronica']} themeName={themeConfigs['tienda-electronica'].name} layoutVariant={themeConfigs['tienda-electronica'].layoutVariant} />
);

export const TiendaJoyeriaTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-joyeria']} themeName={themeConfigs['tienda-joyeria'].name} />
);

export const TiendaMotocicletasTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-motocicletas']} themeName={themeConfigs['tienda-motocicletas'].name} layoutVariant={themeConfigs['tienda-motocicletas'].layoutVariant} />
);

export const TiendaRopa1Theme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-ropa-1']} themeName={themeConfigs['tienda-ropa-1'].name} />
);

export const TiendaZapatillasTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-zapatillas']} themeName={themeConfigs['tienda-zapatillas'].name} layoutVariant={themeConfigs['tienda-zapatillas'].layoutVariant} />
);

export const TiendaJuegosTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-juegos']} themeName={themeConfigs['tienda-juegos'].name} layoutVariant={themeConfigs['tienda-juegos'].layoutVariant} />
);

export const TiendaMascotasTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-mascotas']} themeName={themeConfigs['tienda-mascotas'].name} layoutVariant={themeConfigs['tienda-mascotas'].layoutVariant} />
);

export const TiendaAccesorios2Theme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-accesorios-2']} themeName={themeConfigs['tienda-accesorios-2'].name} />
);

export const TiendaPerfumesTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-perfumes']} themeName={themeConfigs['tienda-perfumes'].name} />
);

export const TiendaSuplementosTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-suplementos']} themeName={themeConfigs['tienda-suplementos'].name} layoutVariant={themeConfigs['tienda-suplementos'].layoutVariant} />
);

export const TiendaBolsosTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-bolsos']} themeName={themeConfigs['tienda-bolsos'].name} layoutVariant={themeConfigs['tienda-bolsos'].layoutVariant} />
);

export const TiendaVitaminasTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-vitaminas']} themeName={themeConfigs['tienda-vitaminas'].name} />
);

export const TiendaMovilModaTheme = (props: any) => (
    <UnifiedTheme {...props} colors={themeConfigs['tienda-movil-moda']} themeName={themeConfigs['tienda-movil-moda'].name} layoutVariant={themeConfigs['tienda-movil-moda'].layoutVariant} />
);

