 import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
