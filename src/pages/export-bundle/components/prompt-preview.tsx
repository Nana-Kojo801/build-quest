import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface PromptPreviewProps {
  prompt: string
}

const COLLAPSED_HEIGHT = 280

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the textarea
    }
  }

  const lineCount = prompt.split('\n').length
  const charCount = prompt.length

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Prompt Preview
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            {lineCount} lines · {charCount.toLocaleString()} chars
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={cn(
              'gap-1.5 h-7 px-2.5 text-xs transition-all duration-200',
              copied && 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
            )}
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <motion.div
        className="relative rounded-xl overflow-hidden border border-border/60 bg-[hsl(240_8%_5%)]"
        animate={{ height: expanded ? 'auto' : COLLAPSED_HEIGHT }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ minHeight: COLLAPSED_HEIGHT }}
      >
        {/* Terminal-style top bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary/60 border-b border-border/40 sticky top-0 z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          <span className="text-[11px] text-muted-foreground ml-2 font-mono">PROMPT.md</span>
        </div>

        {/* Code content */}
        <ScrollArea className="w-full">
          <pre
            className={cn(
              'p-4 text-[12px] leading-relaxed font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words',
              !expanded && 'max-h-none'
            )}
          >
            {renderPromptWithSyntax(prompt)}
          </pre>
        </ScrollArea>

        {/* Fade overlay when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[hsl(240_8%_5%)] to-transparent pointer-events-none" />
        )}
      </motion.div>

      {/* Expand / collapse toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded((e) => !e)}
        className="w-full mt-2 h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
      >
        {expanded ? (
          <>
            <ChevronUp size={13} />
            Show less
          </>
        ) : (
          <>
            <ChevronDown size={13} />
            Show full prompt ({lineCount} lines)
          </>
        )}
      </Button>
    </div>
  )
}

// Minimal syntax coloring: headings, code, emphasis
function renderPromptWithSyntax(prompt: string) {
  const lines = prompt.split('\n')

  return lines.map((line, i) => {
    const isH1 = line.startsWith('# ')
    const isH2 = line.startsWith('## ')
    const isH3 = line.startsWith('### ')
    const isBullet = /^[-*] /.test(line)
    const isHR = /^---+$/.test(line.trim())
    const isCodeFence = line.trim().startsWith('```')

    const content = line

    return (
      <span key={i} className="block">
        {isH1 ? (
          <span className="text-primary font-bold text-sm">{content}</span>
        ) : isH2 ? (
          <span className="text-violet-300 font-semibold">{content}</span>
        ) : isH3 ? (
          <span className="text-sky-300 font-medium">{content}</span>
        ) : isHR ? (
          <span className="text-border">{'─'.repeat(50)}</span>
        ) : isCodeFence ? (
          <span className="text-emerald-400/70">{content}</span>
        ) : isBullet ? (
          <span>
            <span className="text-primary/70">{content.slice(0, 2)}</span>
            <span className="text-foreground/80">{content.slice(2)}</span>
          </span>
        ) : (
          <span className="text-muted-foreground/90">{content}</span>
        )}
      </span>
    )
  })
}
