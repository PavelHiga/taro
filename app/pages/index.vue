<template>
  <div class="min-h-screen flex flex-col px-6 py-10">
    <div class="text-center space-y-8 flex-1">
      <!-- Магический заголовок с фиолетовым градиентом -->
      <div class="space-y-6 mt-10">
        <h1 class="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-tight drop-shadow-lg">
          TaroAI
        </h1>
        
        <!-- Описание -->
        <div class="space-y-4">
          <p class="text-gray-800 text-lg md:text-xl font-semibold">
            🔮 TaroAI — Искусственный интеллект, который видит глубже
          </p>
          <p class="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Задай вопрос. Выбери карты. Получи ответ, который тебе нужен.
          </p>
        </div>
      </div>

      <!-- Форма с инпутом -->
      <div class="pt-6 max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <textarea
              v-model="question"
              placeholder="Задайте свой вопрос картам Таро..."
              class="w-full p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none min-h-32 bg-white/80 backdrop-blur-sm text-black"
              maxlength="200"
              rows="4"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2 text-right">{{ question.length }}/200</p>
          </div>
        </form>
      </div>
    </div>
    <!-- Кнопка действия внизу -->
    <div class="pt-4 mt-auto max-w-2xl w-full mx-auto">
      <button 
        type="button"
        @click="handleSubmit"
        :disabled="!question.trim()"
        class="w-full text-white py-4 px-12 text-xl cursor-pointer font-bold bg-gradient-to-br from-purple-600 to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-xl text-center transition-all duration-150 active:scale-95 shadow-xl border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Задать вопрос 🔮
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const question = ref('');

const handleSubmit = () => {
  if (question.value.trim()) {
    navigateTo({
      path: '/draw',
      query: { question: question.value.trim(), rnd: String(Date.now()) }
    });
  }
};
</script>

<style scoped>

</style>