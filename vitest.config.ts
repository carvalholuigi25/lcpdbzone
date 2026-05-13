import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // setupFiles: ['src/test-setup.ts'],
    // globals: false,
    // environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    alias: {
      '@/': path.resolve(__dirname, 'src/'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@services': path.resolve(__dirname, 'src/app/services'),
      '@models': path.resolve(__dirname, 'src/app/models'),
      '@pages': path.resolve(__dirname, 'src/app/pages'),
      '@modules': path.resolve(__dirname, 'src/app/modules'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
      '@utils': path.resolve(__dirname, 'src/app/utils'),
      '@directives': path.resolve(__dirname, 'src/app/directives'),
      '@pipes': path.resolve(__dirname, 'src/app/pipes'),
      '@guards': path.resolve(__dirname, 'src/app/guards'),
      '@interceptors': path.resolve(__dirname, 'src/app/interceptors'),
      '@decorators': path.resolve(__dirname, 'src/app/decorators'),
      '@validators': path.resolve(__dirname, 'src/app/validators'),
    },
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      reporter: [['html'], ['json'], ['lcov']],
      reportsDirectory: path.join(__dirname, './coverage/lcpdbzone'),
      reportOnFailure: true,
    },
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
  plugins: []
})