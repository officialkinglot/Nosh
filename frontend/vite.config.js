  import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-toastify',
        'react-toastify/dist/ReactToastify.css',
        'axios', // Externalize axios
        'lodash',
        'moment',
        'moment-timezone',
        'react-icons',
        'react-icons/ai',
        'uuid',
        'firebase',
        'date-fns',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-toastify',
      'axios', // Pre-bundle axios
      'lodash',
      'moment',
      'moment-timezone',
      'react-icons',
      'react-icons/ai',
      'uuid',
      'firebase',
      'date-fns',
    ],
  },
});
