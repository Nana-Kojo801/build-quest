import { useUIStore } from '@/stores/ui-store'
import { WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineBanner() {
  const isOnline = useUIStore((s) => s.isOnline)

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="sticky top-0 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-400 font-medium">
            <WifiOff size={13} />
            <span>Offline mode — changes save locally</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
