import { defineNuxtPlugin } from '#app';
import { VueTelegramPlugin } from 'vue-tg';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTelegramPlugin);
});