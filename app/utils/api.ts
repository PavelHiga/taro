// Функция для получения invoice link для оплаты
export async function getInvoiceLink(userId: number, message: string, cards: any[]) {
  const url = 'https://taro-bot-xi.vercel.app/createInvoiceLink';
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

    if (result && typeof result === 'object') {
      if ('success' in result && 'data' in result) {
        return result;
      } else if ('invoiceLink' in result) {
        return {
          success: true,
          data: result.invoiceLink
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error('💥 Ошибка получения invoice link:', error);
    throw error;
  }
}

// Функция для запроса к API таро после оплаты
export async function fetchTarotReadingPaid(userId: number, message: string, cards: any[], paymentData: any) {
  const url = 'https://taro-bot-xi.vercel.app/reading-paid';
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
