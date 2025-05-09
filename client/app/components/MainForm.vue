<template>
  <div class="flex flex-col items-center text-center w-full px-10">
    <NuxtImg src="/tarot-card.png" width="220" height="220" class="ml-7"/>
    <form class="w-full space-y-5 mt-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="draw">
        <FormItem class="flex flex-col">
          <h2 class="text-2xl mb-3">Задай картам вопрос</h2>
          <FormControl>
          <Textarea
              placeholder="Когда я стану счастливым?"
              class="block resize-none min-h-40 bg-white/10 w-full"
              v-bind="componentField"
              maxlength="100"
          />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button
          :disabled="loading"
          class="text-white p-6 w-full text-xl font-bold bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer"
      >
        <Loader2 v-if="loading" class="w-7 h-7 animate-spin" />
        <div v-else class="flex items-center gap-2">
          <p v-if="telegramUser.balance === 0">Пополнить баланс</p>
          <p v-else >Узнать <span class="text-3xl">✨</span></p>
        </div>
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormItem, FormField, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Loader2 } from 'lucide-vue-next'

interface Emits {
  (e: 'submit-click', item: string): void
}
const emit = defineEmits<Emits>()
const { loading, telegramUser } = storeToRefs(useTaroStore())

const formSchema = toTypedSchema(z.object({
  draw: z
      .string({ message: 'Поле обязательно для заполнения' })
      .min(5, {
        message: 'Минимальная длинна - 5 символов',
      })
      .max(150, {
        message: 'Максимальная длинна - 100 символов',
      }),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit( (values) => {
  emit('submit-click', values.draw)
})


</script>

<style scoped>

</style>