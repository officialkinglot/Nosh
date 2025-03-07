 import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Use the React plugin for Vite
  base: '/', // Base public path for the application
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-toastify',
        'react-toastify/dist/ReactToastify.css', // Externalize CSS files
        'axios', // Externalize axios
        'lodash',
        'moment',
        'moment-timezone',
        'react-icons',
        'react-icons/ai', // Externalize specific react-icons
        'uuid',
        'firebase',
        'date-fns',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for the src directory
      '@components': '/src/components', // Alias for components
      '@pages': '/src/pages', // Alias for pages
      '@utils': '/src/utils', // Alias for utility functions
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
      'react-icons/ai', // Pre-bundle specific react-icons
      'uuid',
      'firebase',
      'date-fns',
    ],
  },
});
