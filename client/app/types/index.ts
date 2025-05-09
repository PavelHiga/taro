export type TarotPosition = 'past' | 'present' | 'future'

export type TarotCard = {
    position: TarotPosition
    name_ru: string
    name_en: string
    description: string
    image: string | null
}

export type SummaryBlock =
    | { "Прошлое": string }
    | { "Настоящее": string }
    | { "Будущее": string }
    | { "Совет": string }


export interface TarotResult {
    cards: TarotCard[]
    summary: SummaryBlock[]
}

export interface TelegramUser {
    id: number
    username: string
    first_name: string
    last_name?: string
    language_code?: string,
    balance?: number
}
