// Конфигурация API
export const API_CONFIG = {
  // URL бэкенд сервера
  BASE_URL: (() => {
    // Очищаем localStorage от старых URL
    if (typeof window !== 'undefined') {
      const customUrl = localStorage.getItem('taro_api_url');
      if (customUrl && customUrl.includes('ngrok')) {
        localStorage.removeItem('taro_api_url');
      }
    }
    
    // Используем относительные пути - Nuxt прокси будет перенаправлять на backend
    return ''
  })(),
}

// Функция для получения полного URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Функция для установки API URL (для отладки)
export function setApiUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('taro_api_url', url);
    console.log('API URL установлен:', url);
  }
}

// Функция для получения текущего API URL
export function getCurrentApiUrl(): string {
  return API_CONFIG.BASE_URL;
}

// Функция для получения invoice link для оплаты
export async function getInvoiceLink(userId: number, message: string, cards: any[]) {
  const url = '/api/tg/getInvoiceLink';
  console.log('🔗 Получаем invoice link для userId:', userId);
  
  try {
    const result = await $fetch(url, {
      method: 'POST',
      body: {
        userId,
        message,
        cards
      }
    });

    console.log('✅ Invoice link получен:', result);
    return result;
  } catch (error) {
    console.error('💥 Ошибка получения invoice link:', error);
    throw error;
  }
}

// Функция для запроса к API таро после оплаты
export async function fetchTarotReadingPaid(userId: number, message: string, cards: any[], paymentData: any) {
  const url = '/api/taro/reading-paid';
  console.log('🚀 Отправляем запрос на оплаченное гадание:', url);
  console.log('📦 Данные:', { userId, message, cards, paymentData });
  
  try {
    const result = await $fetch(url, {
      method: 'POST',
      body: {
        userId,
        message,
        cards,
        paymentData
      }
    });

    console.log('✅ Успешный ответ:', result);
    return result;
  } catch (error) {
    console.error('💥 Ошибка запроса:', error);
    throw error;
  }
}
