import { motion } from 'framer-motion'
import { CheckCircle2, Download, ArrowLeft, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportSuccessStateProps {
  projectTitle: string
  onDownloadAgain: () => void
  onBack: () => void
}

const CONFETTI_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.4,
  color: ['bg-primary', 'bg-primary/60', 'bg-emerald-400', 'bg-sky-400', 'bg-primary/40'][i % 5],
}))

export function ExportSuccessState({ projectTitle, onDownloadAgain, onBack }: ExportSuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mx-4 my-6 rounded-2xl border border-emerald-500/25 bg-card overflow-hidden"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-primary/6 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Confetti particles */}
      {CONFETTI_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute w-1.5 h-1.5 rounded-full ${p.color} opacity-60`}
          style={{ left: `${p.x}%`, top: 0 }}
          initial={{ y: -10, opacity: 0 }}
          animate={{
            y: [0, 60, 120],
            opacity: [0, 0.8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="relative p-6 flex flex-col items-center text-center gap-4">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-emerald-400 fill-emerald-400/20" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
          >
            <Sparkles size={14} className="text-primary" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-1">
            Mission Files Downloaded!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Claude bundle for{' '}
            <span className="text-foreground font-semibold">{projectTitle}</span>{' '}
            is ready to deploy.
          </p>
        </motion.div>

        {/* XP callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/25"
        >
          <Zap size={15} className="text-primary" />
          <span className="text-sm font-semibold text-primary">+100 XP</span>
          <span className="text-xs text-primary/60">for exporting your bundle</span>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full rounded-xl bg-secondary/40 border border-border/50 p-4 text-left space-y-2"
        >
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Next steps</p>
          {[
            'Unzip the bundle into a new project folder',
            'Open that folder in Claude Code',
            'Run: cat PROMPT.md | claude',
            'Claude will read .claude/ and start building',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-2 w-full"
        >
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onDownloadAgain}
          >
            <Download size={14} />
            Download again
          </Button>
          <Button
            variant="quest"
            className="flex-1 gap-2"
            onClick={onBack}
          >
            <ArrowLeft size={14} />
            Back to project
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
