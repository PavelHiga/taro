import { defineStore } from 'pinia'
import { navigateTo } from '#app'
import type { TarotResult } from "~/types";

export const useTaroStore = defineStore('taro', () => {
    const answer = ref<TarotResult | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const telegramUser = ref({
        id: 0,
        first_name: '',
        last_name: '',
        username: '',
        language_code: '',
        balance: 0
    })

    async function askGPT(question: string) {
        loading.value = true
        error.value = null
        try {
            answer.value = await $fetch('/api/chat', {
                method: 'POST',
                body: { question }
            })
            navigateTo('/result')  // ← работает внутри store
        } catch (err) {
            console.error(err)
            error.value = 'Ошибка получения ответа'
        } finally {
            loading.value = false
        }
    }
    return {
        telegramUser,
        answer,
        loading,
        error,
        askGPT
    }
})
