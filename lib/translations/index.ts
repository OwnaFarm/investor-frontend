import { en, type TranslationKeys } from "./en"
import { id } from "./id"
import { zh } from "./zh"

export type Language = "en" | "id" | "zh"

export const translations: Record<Language, TranslationKeys> = {
  en,
  id,
  zh,
}

export const languageNames: Record<Language, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  zh: "中文",
}

export const languageFlags: Record<Language, string> = {
  en: "🇺🇸",
  id: "🇮🇩",
  zh: "🇨🇳",
}

export type { TranslationKeys }
