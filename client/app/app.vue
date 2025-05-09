<template>
  <div class="bg w-full min-h-screen flex items-center justify-center">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import { useTaroStore } from "~/stores/store";

const supabaseUrl = "https://ooizxooizqtairxyxixe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaXp4b29penF0YWlyeHl4aXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODU4NjEsImV4cCI6MjA2MTg2MTg2MX0.0MDJ7skMa9YZb3ZiNX4EPLB5e2oQ4QJ1wK-80xyRCF4"; // замени на безопасный ключ

const userStore = useTaroStore();

onMounted(async () => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (user) {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          'telegram-id': user.id.toString()
        }
      }
    });

    const { data, error } = await supabase
        .from('users')
        .upsert({
          telegram_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code,
          balance: user.balance ?? 0,
        }, {
          onConflict: 'telegram_id'
        });
    userStore.telegramUser = data ?? userStore.telegramUser;
    if (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    } else {
      console.log('Пользователь сохранён:', data);
    }

    window.Telegram?.WebApp?.ready();
  }
});
</script>
