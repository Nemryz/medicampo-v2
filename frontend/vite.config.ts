import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * CONFIGURACIÓN DE VITE (MediCampo PWA Edition)
 * 
 * DESCRIPCIÓN:
 * Este archivo centraliza la lógica de construcción y plugins del frontend.
 * Hemos integrado 'vite-plugin-pwa' para transformar la web en una aplicación instalable.
 * 
 * CÓMO FUNCIONA:
 * 1. VitePWA: Genera automáticamente un Service Worker y un archivo manifest.json.
 * 2. registerType: 'autoUpdate' garantiza que la app se actualice sola al detectar cambios en el servidor.
 * 3. manifest: Define la identidad visual de la App (iconos, colores de fondo y modo de visualización).
 * 
 * CÓMO MODIFICARLO:
 * - Para cambiar el color de la barra de estado: Edita 'theme_color'.
 * - Para cambiar el nombre de la App: Edita 'name' y 'short_name'.
 * - Para añadir iconos: Coloca los archivos en /public y actualiza el array 'icons'.
 */
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            // Archivos estáticos que deben ser cacheados para uso offline
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'MediCampo: Telemedicina Premium',
                short_name: 'MediCampo',
                description: 'Plataforma de telemedicina segura con tecnología LiveKit SFU.',
                theme_color: '#059669', // Emerald 600 (Color institucional)
                background_color: '#000000', // Fondo negro premium para splash screen
                display: 'standalone', // Hace que la app se abra sin interfaz de navegador
                orientation: 'portrait', // Bloquea la app en modo vertical inicialmente
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
});
