import { useEffect } from 'react'
import useThemeStore from '../stores/useThemeStore'

export default function useThemeSync() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0d0d0d' : '#f5f5f7')
    }
  }, [theme])
}
