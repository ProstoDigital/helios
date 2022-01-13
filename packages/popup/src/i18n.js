import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import resources from './locales'

const ZH_LANGUAGES = ['zh', 'zh-CN', 'zh-TW', 'zh-HK']
i18next.use(initReactI18next).init({
  resources,
  react: {
    useSuspense: true,
  },
  debug: import.meta.env.NODE_ENV === 'development' ? true : false,
  lng:
    navigator?.language && ZH_LANGUAGES.includes(navigator.language)
      ? 'zh'
      : 'en',
  fallbackLng: 'en',
  preload: ['en'],
})

export default i18next
