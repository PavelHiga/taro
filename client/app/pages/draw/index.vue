<template>
  <MainForm @submit-click="askGPT"/>
    <p class="absolute top-4 text-xl text-white">Баланс: {{ telegramUser.balance }}</p>
</template>

<script setup lang="ts">

import { useTaroStore } from "~/stores/store";

const { answer, telegramUser } = storeToRefs(useTaroStore());
const { askGPT } = useTaroStore();

watch(() => answer.value, () => { // Разыменовываем answer.value
  navigateTo("/result");
});
</script>

<style scoped>
</style>

