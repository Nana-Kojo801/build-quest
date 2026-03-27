import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

interface CompletionAnimationProps {
  show: boolean
  xpAmount: number
  onFinish?: () => void
}

export function CompletionAnimation({ show, xpAmount, onFinish }: CompletionAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onFinish}>
      {show && (
        <motion.div
          key="xp-popup"
          initial={{ opacity: 0, scale: 0.6, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -32 }}
          exit={{ opacity: 0, scale: 0.8, y: -56 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 shadow-lg shadow-primary/20"
        >
          <Zap size={11} className="text-primary fill-primary" />
          <span className="text-xs font-bold text-primary">+{xpAmount} XP</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
