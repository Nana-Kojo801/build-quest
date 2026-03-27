import { motion } from 'framer-motion'
import { FileText, Folder, FolderOpen, File } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ProjectIdea } from '@/lib/types'

interface BundleContentsProps {
  idea: ProjectIdea
}

interface FileNode {
  name: string
  type: 'file' | 'dir'
  description?: string
  children?: FileNode[]
}

function buildFileTree(idea: ProjectIdea): FileNode[] {
  const slug = idea.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return [
    {
      name: `${slug}-claude-bundle/`,
      type: 'dir',
      children: [
        {
          name: '.claude/',
          type: 'dir',
          children: [
            {
              name: 'CLAUDE.md',
              type: 'file',
              description: 'Project context, constraints & working style for Claude',
            },
            {
              name: 'config.json',
              type: 'file',
              description: 'Structured page + component spec in JSON',
            },
            {
              name: 'rules/',
              type: 'dir',
              children: [
                {
                  name: 'architecture.md',
                  type: 'file',
                  description: 'Folder structure, routing, state rules',
                },
                {
                  name: 'ui-system.md',
                  type: 'file',
                  description: 'Visual direction, interaction expectations',
                },
                {
                  name: 'coding-conventions.md',
                  type: 'file',
                  description: 'File naming, component breakdown standards',
                },
              ],
            },
          ],
        },
        {
          name: 'PROMPT.md',
          type: 'file',
          description: 'The main Claude Code prompt — start here',
        },
        {
          name: 'README.md',
          type: 'file',
          description: 'Getting started guide for the bundle',
        },
      ],
    },
  ]
}

interface FileRowProps {
  node: FileNode
  depth: number
  index: number
}

function FileRow({ node, depth, index }: FileRowProps) {
  const isDir = node.type === 'dir'
  const hasChildren = isDir && (node.children?.length ?? 0) > 0
  const indentPx = depth * 16

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.04 }}
        className="flex items-start gap-2.5 py-1.5 group"
        style={{ paddingLeft: indentPx }}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isDir ? (
            hasChildren ? (
              <FolderOpen size={14} className="text-amber-400/70" />
            ) : (
              <Folder size={14} className="text-amber-400/50" />
            )
          ) : node.name === 'PROMPT.md' ? (
            <FileText size={14} className="text-primary" />
          ) : node.name === 'CLAUDE.md' ? (
            <FileText size={14} className="text-violet-400" />
          ) : (
            <File size={14} className="text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={
              isDir
                ? 'text-sm font-semibold text-amber-300/80'
                : node.name === 'PROMPT.md'
                ? 'text-sm font-semibold text-primary'
                : node.name === 'CLAUDE.md'
                ? 'text-sm font-semibold text-violet-300'
                : 'text-sm text-foreground/80'
            }
          >
            {node.name}
          </span>
          {node.description && (
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              {node.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Children */}
      {node.children?.map((child, i) => (
        <FileRow key={child.name} node={child} depth={depth + 1} index={index + i + 1} />
      ))}
    </>
  )
}

export function BundleContents({ idea }: BundleContentsProps) {
  const tree = buildFileTree(idea)

  return (
    <div className="px-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Bundle Contents
      </h2>

      <Card className="overflow-hidden border-border/60">
        {/* Header bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary/40 border-b border-border/40">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          <span className="text-[11px] text-muted-foreground ml-2 font-mono">
            file explorer
          </span>
        </div>

        {/* Tree */}
        <div className="p-4 font-mono">
          {tree.map((node, i) => (
            <FileRow key={node.name} node={node} depth={0} index={i} />
          ))}
        </div>
      </Card>

      {/* Instruction callout */}
      <div className="mt-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
        <p className="text-xs text-primary/90 leading-relaxed">
          <span className="font-semibold">How to use:</span> Unzip the bundle, open the folder in Claude Code, then run{' '}
          <code className="bg-primary/15 px-1 py-0.5 rounded text-[11px]">cat PROMPT.md | claude</code>{' '}
          or paste <code className="bg-primary/15 px-1 py-0.5 rounded text-[11px]">PROMPT.md</code> as your first message.
        </p>
      </div>
    </div>
  )
}
