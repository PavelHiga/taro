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

// Типы для Telegram WebApp
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initData: string
                initDataUnsafe: {
                    user?: {
                        id: number
                        first_name: string
                        last_name?: string
                        username?: string
                        language_code?: string
                    }
                    query_id?: string
                    auth_date?: number
                    hash?: string
                }
                openInvoice: (url: string, callback?: (status: string) => void) => void
                showAlert: (message: string) => void
                close: () => void
                ready: () => void
                expand: () => void
                MainButton: {
                    text: string
                    color: string
                    textColor: string
                    isVisible: boolean
                    isActive: boolean
                    isProgressVisible: boolean
                    setText: (text: string) => void
                    onClick: (callback: () => void) => void
                    offClick: (callback: () => void) => void
                    show: () => void
                    hide: () => void
                    enable: () => void
                    disable: () => void
                    showProgress: (leaveActive?: boolean) => void
                    hideProgress: () => void
                }
                BackButton: {
                    isVisible: boolean
                    onClick: (callback: () => void) => void
                    offClick: (callback: () => void) => void
                    show: () => void
                    hide: () => void
                }
            }
        }
    }
}
