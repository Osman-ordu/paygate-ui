import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const preloadCriticalAssetsPlugin = (): Plugin => ({
  name: 'preload-critical-assets',
  enforce: 'post',
  transformIndexHtml: {
    enforce: 'post',
    handler(html: string) {
      const cssHref = html.match(/href="(\/assets\/[^"]+\.css)"/)?.[1];
      const jsSrc  = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];

      const hints = [
        cssHref ? `<link rel="preload" href="${cssHref}" as="style" crossorigin>` : '',
        jsSrc   ? `<link rel="modulepreload" href="${jsSrc}" crossorigin>` : '',
      ].filter(Boolean).join('\n    ');

      return hints ? html.replace('<meta charset', `${hints}\n    <meta charset`) : html;
    },
  },
});

export default defineConfig({
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 5173 },
  plugins: [react(), svgr(), preloadCriticalAssetsPlugin()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  css: {
    preprocessorOptions: {
      scss: { silenceDeprecations: ['legacy-js-api'] },
    },
  },
});
