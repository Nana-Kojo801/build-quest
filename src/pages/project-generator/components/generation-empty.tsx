import { motion } from 'framer-motion'
import { Sparkles, Wand2, Zap, Star } from 'lucide-react'

const FLOATING_ITEMS = [
  { icon: Sparkles, x: '15%', y: '20%', delay: 0, color: 'text-primary/40' },
  { icon: Star, x: '75%', y: '15%', delay: 0.4, color: 'text-amber-400/30' },
  { icon: Zap, x: '80%', y: '65%', delay: 0.8, color: 'text-primary/30' },
  { icon: Sparkles, x: '10%', y: '70%', delay: 1.2, color: 'text-sky-400/30' },
]

export function GenerationEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative mx-4 mt-2 rounded-2xl border border-dashed border-border/60 bg-card/30 overflow-hidden"
      style={{ minHeight: 280 }}
    >
      {/* Floating decorative icons */}
      {FLOATING_ITEMS.map(({ icon: Icon, x, y, delay, color }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color}`}
          style={{ left: x, top: y }}
          animate={{ y: [0, -8, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={18} />
        </motion.div>
      ))}

      {/* Center content */}
      <div className="flex flex-col items-center justify-center h-full py-14 px-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center mb-5"
        >
          <Wand2 size={28} className="text-primary" />
        </motion.div>

        <h3 className="text-lg font-bold text-foreground text-center mb-2">
          Ready to generate ideas?
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
          Configure the controls above and hit{' '}
          <span className="text-primary font-medium">Generate</span> to get
          a fresh batch of project ideas tailored for solo builders.
        </p>

        {/* Feature bullets */}
        <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
          {[
            'Full page breakdown & feature list',
            'Estimated days & tech direction',
            'Save, start, or regenerate ideas',
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
