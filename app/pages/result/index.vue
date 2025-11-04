<template>
  <div class="min-h-screen px-6 py-6 flex flex-col">
    <BackButton @click="goBack" />
    
    <div v-if="answer" class="flex-1 mt-6">
      <TaroResult
        :data="answer"
        @go-back-click="goBack"
      />
    </div>
    
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-600 text-lg">Нет данных для отображения</p>
        <Button @click="goBack" class="mt-4">
          Вернуться назад
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from 'vue-tg'
import { Button } from '~/components/ui/button'

const { answer } = storeToRefs(useTaroStore())

function goBack(): void {
  answer.value = null
  navigateTo('/')
}
</script>

<style scoped>

</style>