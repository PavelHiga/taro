import { OpenAI } from 'openai'
import { tarotSystemPrompt } from '~/utils/tarotPrompt'
import type { TarotResult } from '~/types'
import { readFile } from 'fs/promises'
import { join } from 'path'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // 🔸 Загружаем JSON с картинками
    const filePath = join(process.cwd(), 'server/assets/tarot-images.json')
    const data = await readFile(filePath, 'utf-8')
    const raw = JSON.parse(data)

    if (!Array.isArray(raw.cards)) {
        throw createError({ statusCode: 500, statusMessage: 'Формат tarot-images.json неверный' })
    }

    const images = raw.cards

    // 🔸 Запрос к GPT
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: tarotSystemPrompt },
            { role: 'user', content: body.question }
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "tarot_reading",
                schema: {
                    type: "object",
                    properties: {
                        cards: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    position: { type: "string", enum: ["past", "present", "future"] },
                                    name_ru: { type: "string" },
                                    name_en: { type: "string" }
                                },
                                required: ["position", "name_ru", "name_en"]
                            },
                            minItems: 3,
                            maxItems: 3
                        },
                        summary: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    "Прошлое": { type: "string" },
                                    "Настоящее": { type: "string" },
                                    "Будущее": { type: "string" },
                                    "Совет": { type: "string" }
                                },
                                minProperties: 1,
                                maxProperties: 1,
                                additionalProperties: false
                            },
                            minItems: 4,
                            maxItems: 4
                        }
                    },
                    required: ["cards", "summary"]
                }
            }
        } as any


    })

    let content = response.choices?.[0]?.message?.content
    console.log('content', content)
    if (!content) {
        throw createError({ statusCode: 500, statusMessage: 'Пустой ответ от GPT' })
    }

    // 🔸 Убираем ```json ... ``` если GPT обернул ответ
    content = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')

    let parsed: TarotResult
    try {
        parsed = JSON.parse(content)
    } catch (e) {
        console.error('Ошибка парсинга JSON от GPT:', content)
        throw createError({ statusCode: 500, statusMessage: 'Невалидный JSON от GPT' })
    }

    // 🔸 Сопоставляем с изображениями
    const result: TarotResult = {
        summary: parsed.summary,
        cards: parsed.cards.map((card) => {
            const match = images.find((img: any) =>
                img.name?.toLowerCase().trim() === card.name_en.toLowerCase().trim() ||
                img.name_ru?.toLowerCase().trim() === card.name_ru.toLowerCase().trim()
            )

            if (!match) {
                console.warn(`❗ Не найдена картинка для карты: ${card.name_en} / ${card.name_ru}`)
            }

            return {
                ...card,
                image: match?.img || null
            }
        })
    }
    return result
})
