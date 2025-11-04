import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'vercel',
    devProxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ],
      script: [{src: 'https://telegram.org/js/telegram-web-app.js'}],
    }
  },
  css: ['~/assets/styles/tailwind.css', "~/assets/styles/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'a461ddb8db2d.ngrok-free.app'
      ]
    }
  },
  modules: ['shadcn-nuxt', '@nuxt/icon', '@pinia/nuxt', '@nuxt/image'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  image: {},
  icon: {
    mode: 'css',
    cssLayer: 'base'
  },
  devServer: {
    host: process.env.DEV_HOST
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.DEV_HOST ?? 'http://localhost:3000',
    }
  },

})