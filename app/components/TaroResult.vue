<template>
  <div class="flex flex-col space-y-8 max-w-4xl mx-auto">
    <!-- Заголовок -->
    <div class="text-center space-y-4">
      <div class="space-y-2">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-tight drop-shadow-lg">
          Ваш расклад Таро
        </h1>
        <p class="text-gray-700 text-lg md:text-xl font-medium">
          🔮 Карты открыли свои тайны
        </p>
      </div>
    </div>

    <!-- Карты -->
    <div v-if="data?.cards && data.cards.length > 0" class="flex flex-row gap-4 justify-center items-center mt-3">
      <div 
        v-for="(card, index) in data.cards" 
        :key="index"
        class="flex flex-col items-center space-y-3"
      >
        <!-- Карта -->
        <div class="card-container">
          <div class="card-inner">
            <div class="card-front">
              <img 
                :src="`/cards/${card.image}`" 
                :alt="`Карта ${index + 1}`"
                class="w-22 h-35 rounded-lg shadow-xl object-cover border-2 border-purple-400"
              />
            </div>
          </div>
        </div>
        
        <!-- Название карты -->
        <div class="text-center w-24">
          <div class="text-gray-800">
            <div class="card-title font-bold text-sm leading-tight break-words">{{ card.name_ru }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Расшифровка -->
    <div v-if="data?.summary && data.summary.length > 0" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Расшифровка расклада</h2>
      <div class="space-y-4">
        <div
          v-for="(block, index) in data.summary"
          :key="index"
          class="bg-white rounded-xl p-6 shadow-lg border border-purple-100 transition-shadow duration-300 hover:shadow-xl"
        >
          <h3 class="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">
            <span class="text-2xl">{{ getSectionIcon(Object.keys(block)[0] || '') }}</span>
            {{ Object.keys(block)[0] || '' }}
          </h3>
          <p class="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
            {{ Object.values(block)[0] || '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Кнопка -->
    <div class="pt-4 mt-auto mb-10">
      <Button
        class="w-full text-white py-7 px-12 text-xl cursor-pointer font-bold bg-gradient-to-br from-purple-600 to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-xl text-center transition-all duration-150 active:scale-95 shadow-xl border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        @click="emit('go-back-click')"
      >
        Благодарю 🔮
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TarotResult } from "~/types";
import { Button } from "~/components/ui/button";

interface Emits {
  (e: 'go-back-click'): void
}
interface TTarotResult {
  data: TarotResult | null,
}

const props = defineProps<TTarotResult>()
const emit = defineEmits<Emits>()

function getSectionIcon(section: string): string {
  const icons: Record<string, string> = {
    'Прошлое': '🕰️',
    'Настоящее': '⏳',
    'Будущее': '🔮',
    'Совет': '💡'
  }
  return icons[section] || '✨'
}
</script>

<style scoped>
.card-container {
  width: 96px;
  height: 144px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}

.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  top: 0;
  left: 0;
}

/* Ограничиваем заголовок по высоте под две строки и сохраняем сетку */
.card-title {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2; /* показывать не более 2 строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 34px; /* резерв высоты примерно для двух строк малого шрифта */
}
</style>
