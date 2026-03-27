import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'
import { X, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ToastRegion() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md',
              toast.variant === 'default' && 'bg-popover border-border text-foreground',
              toast.variant === 'success' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
              toast.variant === 'destructive' && 'bg-destructive/10 border-destructive/30 text-red-300',
              toast.variant === 'xp' && 'bg-primary/10 border-primary/30 text-primary',
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.variant === 'success' && <CheckCircle size={16} />}
              {toast.variant === 'destructive' && <AlertCircle size={16} />}
              {toast.variant === 'xp' && <Zap size={16} className="fill-current" />}
              {toast.variant === 'default' && <div className="h-4 w-4 rounded-full bg-primary/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">{toast.title}</p>
              {toast.description && (
                <p className="text-xs mt-1 opacity-80 leading-snug">{toast.description}</p>
              )}
              {toast.xpAmount && (
                <p className="text-xs mt-1 font-bold text-primary">+{toast.xpAmount} XP</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
