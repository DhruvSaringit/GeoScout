import crypto from 'node:crypto';
if (!crypto.hash) {
  crypto.hash = function(algorithm, data, outputEncoding) {
    const h = crypto.createHash(algorithm).update(data);
    return outputEncoding ? h.digest(outputEncoding) : h.digest();
  };
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
})
