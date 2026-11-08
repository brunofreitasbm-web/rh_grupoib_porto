import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKSPACE_BRANDING as PORTO } from './src/config/branding.porto.js';
import { WORKSPACE_BRANDING as GRUPOIB } from './src/config/branding.grupoib.js';

const WORKSPACES = { 'porto-terapia': PORTO, grupoib: GRUPOIB };
const WORKSPACE_FILES = { 'porto-terapia': 'branding.porto.js', grupoib: 'branding.grupoib.js' };
const here = path.dirname(fileURLToPath(import.meta.url));

// Roda em Node (não passa pelo bundler), por isso lê VITE_WORKSPACE_ID via
// loadEnv/process.env em vez de import.meta.env — ver src/config/branding.js.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const workspaceId = process.env.VITE_WORKSPACE_ID || env.VITE_WORKSPACE_ID;
  const resolvedId = WORKSPACES[workspaceId] ? workspaceId : 'porto-terapia';
  const branding = WORKSPACES[resolvedId];

  return {
    resolve: {
      // Cada build enxerga só o branding do próprio workspace (ver src/config/branding.js).
      alias: {
        '@workspace-branding': path.resolve(here, 'src/config', WORKSPACE_FILES[resolvedId]),
      },
    },
    define: {
      // Módulos exclusivos de um workspace saem do bundle do outro (dead-code elimination).
      __PJ_MODULE_ENABLED__: JSON.stringify(Boolean(branding.showProfessionalsModule)),
      __FREELANCE_MODULE_ENABLED__: JSON.stringify(Boolean(branding.showFreelanceModule)),
      __TALENT_BANK_ENABLED__: JSON.stringify(Boolean(branding.showTalentBankModule)),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        // Modelos do face-api.js (public/models) não têm extensão de arquivo reconhecida
        // pelo glob padrão do workbox, então precisam ser incluídos explicitamente.
        includeAssets: ['models/**/*'],
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\/assets\//],
          maximumFileSizeToCacheInBytes: 5000000,
        },
        manifest: {
          name: branding.appTitle,
          short_name: branding.shortName,
          description: 'Sistema de Ponto e Controle para RH',
          theme_color: branding.themeColor,
          background_color: branding.themeColor,
          display: 'standalone',
          icons: branding.logoPath
            ? [
                { src: branding.logoPath, sizes: '192x192', type: branding.logoType },
                { src: branding.logoPath, sizes: '512x512', type: branding.logoType },
              ]
            : []
        }
      }),
      // Grava o título/theme-color certos direto no HTML de build (não só
      // via JS em main.jsx), pra nenhum crawler/primeira pintura da tela
      // chegar a mostrar o branding do outro workspace, nem por um instante.
      {
        name: 'inject-workspace-branding-html',
        transformIndexHtml(html) {
          return html
            .replace(
              '<!--workspace-favicon-->',
              `<link rel="icon" type="${branding.faviconType}" href="${branding.faviconPath}" />`
            )
            .replace(/<title>.*<\/title>/, `<title>${branding.appTitle}</title>`)
            .replace(
              /<meta name="theme-color" content="[^"]*"\s*\/>/,
              `<meta name="theme-color" content="${branding.themeColor}" />`
            );
        }
      }
    ],
    server: {
      host: true,
      port: 8080,
    },
    build: {
      // Source maps completos só em build de desenvolvimento/preview. Em
      // produção eles expunham o código-fonte inteiro (com comentários sobre
      // RLS, nomes de tabelas e lógica de negócio) em /assets/*.map.
      sourcemap: mode === 'production' ? false : true,
      rollupOptions: {
        output: {
          manualChunks: {
            recharts: ['recharts'],
            vendor: ['react', 'react-dom', 'lucide-react', 'cmdk', 'sonner']
          }
        }
      }
    },
    test: {
      environment: 'node',
      include: ['src/**/__tests__/**/*.test.js'],
    }
  };
});
