<template>
  <div class="min-h-screen px-6 py-10
 flex flex-col">
    <BackButton @click="handleBackButton"/>

    <div class="text-center space-y-8 flex-1 mt-10">
      <!-- Заголовок -->
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
          Откройте карты
        </h1>
        <p class="text-gray-600 text-lg">
          Нажмите на карты, чтобы перевернуть их
        </p>
      </div>

      <!-- Карты -->
      <div class="flex flex-row gap-4 justify-center items-center mt-10">
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="flex flex-col items-center space-y-3"
        >
          <!-- Карта -->
          <div
            @click="flipCard(index)"
            class="card-container cursor-pointer"
            :class="{ 'flipped': card.isFlipped }"
          >
            <div class="card-inner">
              <!-- Закрытая сторона -->
              <div class="card-back">
                <div class="w-24 h-35 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-xl flex items-center justify-center border-2 border-purple-400">
                  <div class="text-4xl">🔮</div>
                </div>
              </div>
              
              <!-- Открытая сторона -->
              <div class="card-front">
                <img 
                  :src="`/cards/${card.image}`" 
                  :alt="`Карта ${index + 1}`"
                  class="w-24 h-35 rounded-lg shadow-xl object-cover border-2 border-purple-400"
                />
              </div>
            </div>
          </div>
          
          <!-- Название карты -->
          <div class="text-center w-24">
            <div v-if="card.isFlipped" class="text-gray-800">
              <div class="card-title font-bold text-sm leading-tight break-words">{{ card.nameRu }}</div>
            </div>
            <div v-else class="text-gray-400 text-sm min-h-[34px]">
              Карта {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка результата внизу -->
    <div v-if="allCardsFlipped" class="pt-4 mt-auto mb-5">
      <button 
        @click="showResult"
        :disabled="isLoading"
        class="w-full text-white py-4 px-12 text-xl cursor-pointer font-bold bg-gradient-to-br from-purple-600 to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-xl text-center transition-all duration-150 active:scale-95 shadow-xl border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="paymentStatus === 'processing'">Обработка оплаты...</span>
          <span v-else-if="paymentStatus === 'waiting'">Ожидание оплаты...</span>
          <span v-else>Получаем предсказание...</span>
        </span>
        <span v-else>Получить предсказание</span>
      </button>
    </div>

    <!-- Full-screen loader во время оплаты -->
    <div 
      v-if="isLoading && paymentStatus" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <svg class="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-800 font-semibold text-lg">
          <span v-if="paymentStatus === 'processing'">Обработка оплаты...</span>
          <span v-else-if="paymentStatus === 'waiting'">Ожидание оплаты...</span>
          <span v-else>Получаем предсказание...</span>
        </p>
        <p class="text-gray-600 text-sm text-center max-w-xs">
          <span v-if="paymentStatus === 'waiting'">Пожалуйста, завершите оплату в открывшемся окне</span>
          <span v-else>Пожалуйста, подождите...</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from 'vue-tg'
import { useTaroStore } from "~/stores/store";
import { getInvoiceLink, fetchTarotReadingPaid } from "~/utils/api";
import type { TarotResult } from "~/types";

const { setTarotResult } = useTaroStore();
const isLoading = ref(false);
const paymentStatus = ref<'waiting' | 'processing' | null>(null);
const route = useRoute();

// Состояние карт
const cards = ref([
  { isFlipped: false, image: '', name: '', nameRu: '' },
  { isFlipped: false, image: '', name: '', nameRu: '' },
  { isFlipped: false, image: '', name: '', nameRu: '' }
]);

interface TarotCardData {
  img: string;
  name: string;
  name_ru: string;
}

// Выбор уникальных случайных элементов из массива (алгоритм Фишера-Йетса)
function pickUniqueRandom<T>(source: T[], count: number): T[] {
  if (!Array.isArray(source) || source.length === 0 || count <= 0) return [];
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (copy[i] !== undefined && copy[j] !== undefined) {
      const tmp = copy[i];
      copy[i] = copy[j] as T;
      copy[j] = tmp as T;
    }
  }
  return copy.slice(0, Math.min(count, copy.length));
}

// Загружаем данные карт
onMounted(async () => {
  try {
    const response = await fetch(`/assets/tarot-images.json?rnd=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json() as { cards?: TarotCardData[] };
    const pool = Array.isArray(data?.cards) ? data.cards : [];
    const selected = pickUniqueRandom<TarotCardData>(pool, cards.value.length);
    
    cards.value = cards.value.map((card, index) => ({
      ...card,
      image: selected[index]?.img ?? '',
      name: selected[index]?.name ?? '',
      nameRu: selected[index]?.name_ru ?? ''
    }));
  } catch (error) {
    console.error('Error loading tarot data:', error);
    const fallbackCards: TarotCardData[] = [
      { img: 'm00.jpg', name: 'The Fool', name_ru: 'Дурак' },
      { img: 'm01.jpg', name: 'The Magician', name_ru: 'Маг' },
      { img: 'm02.jpg', name: 'The High Priestess', name_ru: 'Верховная Жрица' }
    ];
    const selected = pickUniqueRandom<TarotCardData>(fallbackCards, cards.value.length);
    cards.value = cards.value.map((card, index) => ({
      ...card,
      image: selected[index]?.img ?? '',
      name: selected[index]?.name ?? '',
      nameRu: selected[index]?.name_ru ?? ''
    }));
  }
});

const flipCard = (index: number) => {
  const card = cards.value[index];
  if (card && !card.isFlipped) {
    card.isFlipped = true;
  }
};

const allCardsFlipped = computed(() => cards.value.every(card => card.isFlipped));

const showResult = async () => {
  if (isLoading.value) return;
  
  const question = route.query.question as string;
  if (!question) {
    console.error('Вопрос не найден');
    return;
  }

  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    alert('Это приложение работает только в Telegram Mini App');
    return;
  }

  const tg = window.Telegram.WebApp;
  const userId = tg.initDataUnsafe?.user?.id;
  
  if (!userId) {
    tg.showAlert('Не удалось определить пользователя. Попробуйте перезапустить приложение.');
    return;
  }

  isLoading.value = true;
  paymentStatus.value = 'processing';
  
  try {
    const cardsData = cards.value.map(card => ({
      name_ru: card.nameRu,
      name_en: card.name,
      image: card.image
    }));

    const invoiceResponse = await getInvoiceLink(userId, question, cardsData) as {
      success?: boolean;
      data?: string;
      error?: string;
    };
    
    if (!invoiceResponse.success || !invoiceResponse.data) {
      tg.showAlert(`Ошибка: ${invoiceResponse.error || 'Не удалось создать счет для оплаты'}`);
      isLoading.value = false;
      paymentStatus.value = null;
      return;
    }

    paymentStatus.value = 'waiting';
    tg.openInvoice(invoiceResponse.data, async (status: string) => {
      if (status === 'paid') {
        paymentStatus.value = 'processing';
        try {
          const result = await fetchTarotReadingPaid(
            userId, 
            question, 
            cardsData,
            { status: 'paid', timestamp: Date.now() }
          ) as {
            success?: boolean;
            data?: TarotResult;
            error?: string;
          };
          
          if (result.success && result.data) {
            setTarotResult(result.data);
            navigateTo('/result');
          } else {
            tg.showAlert('Произошла ошибка при получении расклада. Пожалуйста, свяжитесь с поддержкой.');
          }
        } catch (error) {
          console.error('Ошибка при получении расклада:', error);
          tg.showAlert('Произошла ошибка при получении расклада. Пожалуйста, свяжитесь с поддержкой.');
        } finally {
          isLoading.value = false;
          paymentStatus.value = null;
        }
      } else {
        tg.showAlert(
          status === 'cancelled' ? 'Оплата отменена' : 
          status === 'failed' ? 'Оплата не удалась. Попробуйте еще раз.' : 
          'Неизвестная ошибка'
        );
        isLoading.value = false;
        paymentStatus.value = null;
      }
    });
  } catch (error: any) {
    const errorMsg = error?.data?.error || error?.message || 'Не удалось создать счет для оплаты';
    tg.showAlert(`Ошибка: ${errorMsg}\n\nПопробуйте позже или обратитесь в поддержку.`);
    isLoading.value = false;
    paymentStatus.value = null;
  }
};

const handleBackButton = () => navigateTo('/')
</script>

<style scoped>
.card-container {
  perspective: 1000px;
  width: 96px;
  height: 144px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-container.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  top: 0;
  left: 0;
}

.card-front {
  transform: rotateY(180deg);
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

