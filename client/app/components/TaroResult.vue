<template>
  <div class="flex flex-col items-center space-y-4 px-10 py-8">
    <h1 class="text-white text-xl font-bold">Твои карты</h1>
    <div class="flex gap-2 mb-7">
      <div v-for="card in data?.cards" class="bg-white rounded-lg p-1 text-center flex items-center justify-center flex-col">
        <NuxtImg class="max-w-25" :src="`/cards/${card.image}`" />
        <p class="text-black text-xs">{{ card.name_ru }}</p>
      </div>
    </div>
    <div>
      <h2 class="text-white text-xl font-bold text-center">Расшифровка</h2>
      <div class="mt-4 space-y-4">
        <div
            v-for="(block, index) in data?.summary"
            :key="index"
            class="bg-white/10 p-4 rounded-lg"
        >
          <p class="text-white font-semibold text-base">{{ Object.keys(block)[0] }}</p>
          <p class="text-white text-sm leading-relaxed mt-2">
            {{ Object.values(block)[0] }}
          </p>
        </div>
      </div>
    </div>
    <Button
        class="text-white p-6 w-full mt-3 text-xl font-bold bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer"
        @click="emit('go-back-click')"
    >
      Благодарю
    </Button>
  </div>
</template>

<script setup lang="ts">

import type { TarotResult } from "~/types";
import { Button } from "~/components/ui/button";

interface Emits {
  (e: 'go-back-click'): void
}
interface TTarotResult {
  data: TarotResult | null
}

const props = defineProps<TTarotResult>()
const emit = defineEmits<Emits>()


console.log(props.data)
</script>
