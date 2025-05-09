<template>
  <div>
    <TaroResult
        :data="answer"
        @go-back-click="goBack"
    />
  </div>
</template>

<script setup lang="ts">
const { answer } = storeToRefs(useTaroStore())

function goBack(): void {
  answer.value = null
  navigateTo('/draw')
}
</script>

<style scoped>

</style>