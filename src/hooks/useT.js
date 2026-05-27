import useAppStore from '../store/useAppStore'
import { translations } from '../data/translations'

export function useT() {
  const language = useAppStore(s => s.language)
  return translations[language] ?? translations.pl
}
