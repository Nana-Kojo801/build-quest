import { useUIStore } from '@/stores/ui-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function GeneratingOverlay() {
  const { isGenerating, generatingLabel } = useUIStore()

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-card p-8 shadow-2xl"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative rounded-full bg-primary/20 p-4">
                <Sparkles size={24} className="text-primary animate-float" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{generatingLabel || 'Generating…'}</p>
              <p className="text-sm text-muted-foreground mt-1">BuildQuest is working its magic</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
