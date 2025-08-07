import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.frag', '**/*.vert'],
      exclude: undefined,
      warnDuplicatedImports: true,
      defaultExtension: 'glsl',
      watch: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    assetsInlineLimit: 0, // Don't inline shader files
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep shader files in their original structure
          if (
            assetInfo.name &&
            (assetInfo.name.endsWith('.frag') ||
              assetInfo.name.endsWith('.vert'))
          ) {
            return 'shaders/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
}))
