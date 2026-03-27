import { create } from 'zustand'
import { generateId } from '@/lib/utils'

interface Toast {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'destructive' | 'xp'
  xpAmount?: number
  duration?: number
}

interface UIStore {
  // Toast
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Global loading
  isGenerating: boolean
  generatingLabel: string
  setGenerating: (isGenerating: boolean, label?: string) => void

  // Offline status
  isOnline: boolean
  setOnline: (online: boolean) => void

  // Active nav tab
  activeRoute: string
  setActiveRoute: (route: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = generateId()
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, toast.duration ?? 4000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  isGenerating: false,
  generatingLabel: '',
  setGenerating: (isGenerating, label = '') => set({ isGenerating, generatingLabel: label }),

  isOnline: navigator.onLine,
  setOnline: (isOnline) => set({ isOnline }),

  activeRoute: '/',
  setActiveRoute: (activeRoute) => set({ activeRoute }),
}))
