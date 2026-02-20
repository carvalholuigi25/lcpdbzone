import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      reporter: [['html'], ['json'], ['lcov']],
      reportsDirectory: path.join(__dirname, './coverage/lcpdbzone'),
      reportOnFailure: true,
    },
  },
})