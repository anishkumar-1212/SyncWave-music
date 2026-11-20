import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The automatic runtime prevents JSX from requiring `import React` in every file.
export default defineConfig({
  plugins: [react()],
});
