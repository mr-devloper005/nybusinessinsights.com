'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storageKeys } from '@/lib/local-storage'

type ThemeMode = 'light' | 'dark'

export function ThemeToggleFab() {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const nextMode: ThemeMode = 'light'
    document.documentElement.classList.remove('dark')
    window.localStorage.setItem(storageKeys.theme, nextMode)
    setMode(nextMode)
  }, [])

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(nextMode)
    document.documentElement.classList.toggle('dark', nextMode === 'dark')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKeys.theme, nextMode)
    }
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Button
        size="icon"
        onClick={toggleTheme}
        className="h-12 w-12 rounded-full shadow-xl shadow-primary/20"
        aria-label="Toggle day and night theme"
      >
        {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </motion.div>
  )
}
