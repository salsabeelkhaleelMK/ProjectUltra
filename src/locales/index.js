import { createI18n } from 'vue-i18n'
import en from './en'
import it from './it'
import de from './de'
import fr from './fr'
import nl from './nl'

// Get saved language preference or detect from browser
function getDefaultLocale() {
  const saved = localStorage.getItem('app-locale')
  if (saved && ['en', 'it', 'de', 'fr', 'nl'].includes(saved)) {
    return saved
  }
  
  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  // Map browser language to supported locales
  const langMap = {
    'en': 'en',
    'it': 'it',
    'de': 'de',
    'fr': 'fr',
    'nl': 'nl'
  }
  
  return langMap[langCode] || 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    it,
    de,
    fr,
    nl
  }
})

export default i18n


