import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { OpenAI } from 'openai';
import { readFile } from 'fs/promises';
import { join } from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';

const tarotSystemPrompt = `
\u0422\u044B \u2014 \u0418\u0418, \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E\u0449\u0438\u0439\u0441\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u0430\u0445 \u0422\u0430\u0440\u043E. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON-\u0444\u043E\u0440\u043C\u0430\u0442\u0435.

\u0421\u0434\u0435\u043B\u0430\u0439 \u0440\u0430\u0441\u043A\u043B\u0430\u0434 \u0438\u0437 \u0442\u0440\u0451\u0445 \u043A\u0430\u0440\u0442: past (\u043F\u0440\u043E\u0448\u043B\u043E\u0435), present (\u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435), future (\u0431\u0443\u0434\u0443\u0449\u0435\u0435). \u0414\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0439 \u043A\u0430\u0440\u0442\u044B \u0443\u043A\u0430\u0436\u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C \u0438 \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u043E\u043C.

\u0422\u0430\u043A\u0436\u0435 \u0432\u0435\u0440\u043D\u0438 \u043F\u043E\u043B\u0435 "summary" \u2014 \u044D\u0442\u043E \u043C\u0430\u0441\u0441\u0438\u0432 \u0438\u0437 4 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432:
- \u043F\u0435\u0440\u0432\u044B\u0439 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0442\u043E\u043B\u043A\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E,
- \u0432\u0442\u043E\u0440\u043E\u0439 \u2014 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0433\u043E,
- \u0442\u0440\u0435\u0442\u0438\u0439 \u2014 \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043E,
- \u0447\u0435\u0442\u0432\u0451\u0440\u0442\u044B\u0439 \u2014 \u0441\u043E\u0432\u0435\u0442, \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u044F\u044E\u0449\u0438\u0439 \u0432\u0435\u0441\u044C \u0440\u0430\u0441\u043A\u043B\u0430\u0434.

\u0424\u043E\u0440\u043C\u0430\u0442 \u043E\u0442\u0432\u0435\u0442\u0430:
{
  "cards": [
    { "position": "past", "name_ru": "", "name_en": "" },
    { "position": "present", "name_ru": "", "name_en": "" },
    { "position": "future", "name_ru": "", "name_en": "" }
  ],
  "summary": [
    { "\u041F\u0440\u043E\u0448\u043B\u043E\u0435": "..." },
    { "\u041D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435": "..." },
    { "\u0411\u0443\u0434\u0443\u0449\u0435\u0435": "..." },
    { "\u0421\u043E\u0432\u0435\u0442": "..." }
  ]
}

\u26A0\uFE0F \u0412\u043D\u0435 JSON \u043D\u0435 \u043F\u0438\u0448\u0438 \u043D\u0438\u0447\u0435\u0433\u043E. \u041D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 markdown, \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0438\u043B\u0438 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u044F. \u0422\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u0440\u043E\u0433\u043E \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0439 JSON.
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const chat_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const filePath = join(process.cwd(), "server/assets/tarot-images.json");
  const data = await readFile(filePath, "utf-8");
  const raw = JSON.parse(data);
  if (!Array.isArray(raw.cards)) {
    throw createError({ statusCode: 500, statusMessage: "\u0424\u043E\u0440\u043C\u0430\u0442 tarot-images.json \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439" });
  }
  const images = raw.cards;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: tarotSystemPrompt },
      { role: "user", content: body.question }
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
                  "\u041F\u0440\u043E\u0448\u043B\u043E\u0435": { type: "string" },
                  "\u041D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435": { type: "string" },
                  "\u0411\u0443\u0434\u0443\u0449\u0435\u0435": { type: "string" },
                  "\u0421\u043E\u0432\u0435\u0442": { type: "string" }
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
    }
  });
  let content = (_c = (_b = (_a = response.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content;
  console.log("content", content);
  if (!content) {
    throw createError({ statusCode: 500, statusMessage: "\u041F\u0443\u0441\u0442\u043E\u0439 \u043E\u0442\u0432\u0435\u0442 \u043E\u0442 GPT" });
  }
  content = content.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 JSON \u043E\u0442 GPT:", content);
    throw createError({ statusCode: 500, statusMessage: "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0439 JSON \u043E\u0442 GPT" });
  }
  const result = {
    summary: parsed.summary,
    cards: parsed.cards.map((card) => {
      const match = images.find(
        (img) => {
          var _a2, _b2;
          return ((_a2 = img.name) == null ? void 0 : _a2.toLowerCase().trim()) === card.name_en.toLowerCase().trim() || ((_b2 = img.name_ru) == null ? void 0 : _b2.toLowerCase().trim()) === card.name_ru.toLowerCase().trim();
        }
      );
      if (!match) {
        console.warn(`\u2757 \u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u0434\u043B\u044F \u043A\u0430\u0440\u0442\u044B: ${card.name_en} / ${card.name_ru}`);
      }
      return {
        ...card,
        image: (match == null ? void 0 : match.img) || null
      };
    })
  };
  return result;
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
