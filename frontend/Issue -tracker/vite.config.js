import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/

export default defineConfig({
  plugins: [react(),tailwindcss(),],
<<<<<<< HEAD
 /* server: {
    historyApiFallback: true, // Redirect all routes to index.html
  }, */
})
=======
 /*resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },*/
});
>>>>>>> ec830b0558bb7ba6ef8d9edafd5958e6acbcc4ca
