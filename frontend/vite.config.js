 import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the path module for resolving aliases

export default defineConfig({
  plugins: [react()], // Enable React support
  base: '/', // Base public path for the application
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      external: [
        // Externalize dependencies that should not be bundled
        'react',
        'react-dom',
        'react-router-dom',
        'react-toastify',
        'react-toastify/dist/ReactToastify.css',
        'axios',
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
      // Define aliases for easier imports
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  optimizeDeps: {
    include: [
      // Pre-bundle dependencies for faster development
      'react',
      'react-dom',
      'react-router-dom',
      'react-toastify',
      'axios',
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
