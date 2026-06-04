'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { onboardingApi } from '../../lib/api'
import { ROADMAP_TEMPLATES, NODE_W, NODE_H, SVG_W, SVG_H } from '../../lib/roadmaps'
import type { RoadmapNode, RoadmapTemplate, NodeStatus } from '../../lib/roadmaps'

const RADIUS = 12

function edgePath(nodes: RoadmapNode[], fromId: string, toId: string): string {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  const src = nodeMap[fromId]
  const tgt = nodeMap[toId]
  if (!src || !tgt) return ''
  const sx = src.x + NODE_W
  const sy = src.y + NODE_H / 2
  const ex = tgt.x
  const ey = tgt.y + NODE_H / 2
  const dx = (ex - sx) / 2
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
}

function nodeFill(status: NodeStatus) {
  if (status === 'active')    return 'url(#activeGrad)'
  if (status === 'available') return 'url(#availableGrad)'
  return 'rgba(255,255,255,0.04)'
}

function nodeStroke(status: NodeStatus) {
  if (status === 'active')    return 'rgba(99,155,255,0.7)'
  if (status === 'available') return 'rgba(59,130,246,0.3)'
  return 'rgba(255,255,255,0.08)'
}

function nodeTextColor(status: NodeStatus) {
  if (status === 'locked')    return 'rgba(148,163,184,0.55)'
  if (status === 'available') return '#93c5fd'
  return '#ffffff'
}

export default function RoadmapPage() {
  const { loading: authLoading, isLoggedIn } = useAuth()
  const [template, setTemplate] = useState<RoadmapTemplate | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) { setFetching(false); return }

    onboardingApi.getProgress().then(({ data }) => {
      if (!data?.roadmap_id) { setFetching(false); return }

      const tmpl = ROADMAP_TEMPLATES[data.roadmap_id as keyof typeof ROADMAP_TEMPLATES]
      if (!tmpl) { setFetching(false); return }

      // Overlay saved progress onto template nodes
      const progressMap = Object.fromEntries(
        data.progress.map(p => [p.node_id, { status: p.status as NodeStatus, progress: p.progress }])
      )
      const merged: RoadmapTemplate = {
        ...tmpl,
        nodes: tmpl.nodes.map(n => ({
          ...n,
          status: (progressMap[n.id]?.status ?? n.status) as NodeStatus,
          progress: progressMap[n.id]?.progress ?? n.progress,
        })),
      }
      setTemplate(merged)
      setFetching(false)
    })
  }, [authLoading, isLoggedIn])

  if (fetching) {
    return (
      <div className="px-6 py-20 flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm">Loading your roadmap…</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-slate-500 text-sm mb-4">You haven&apos;t completed onboarding yet — your roadmap isn&apos;t generated.</p>
        <Link href="/onboarding" className="text-blue-400 text-sm hover:underline">
          Complete the survey to get your personalised roadmap →
        </Link>
      </div>
    )
  }

  const activeCount    = template.nodes.filter(n => n.status === 'active').length
  const availableCount = template.nodes.filter(n => n.status === 'available').length
  const completedCount = template.nodes.filter(n => n.progress === 100).length

  return (
    <div className="px-6 py-20">

      {/* Hero */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
          Your path forward
        </div>
        <h1 className="text-5xl font-bold mb-3 leading-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          {template.name}
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          {template.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 mb-8 text-sm">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-100">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
        <div className="w-px h-8 bg-white/8" />
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{activeCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">In progress</p>
        </div>
        <div className="w-px h-8 bg-white/8" />
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-500">{availableCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Available</p>
        </div>
        <div className="w-px h-8 bg-white/8" />
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-600">{template.nodes.length - completedCount - activeCount - availableCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Locked</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }} />
          <span className="text-xs text-slate-400">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#1e3a6e', border: '1px solid rgba(59,130,246,0.3)' }} />
          <span className="text-xs text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span className="text-xs text-slate-400">Locked</span>
        </div>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02] p-8">
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="availableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a6e" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="rgba(255,255,255,0.22)" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {template.edges.map((e, i) => (
            <path
              key={i}
              d={edgePath(template.nodes, e.from, e.to)}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* Nodes */}
          {template.nodes.map(node => {
            const cx  = node.x + NODE_W / 2
            const pbX = node.x + 18
            const pbW = NODE_W - 36
            const pbY = node.y + NODE_H - 20
            const isActive = node.status === 'active'

            return (
              <g key={node.id} style={{ cursor: node.status === 'locked' ? 'default' : 'pointer' }} filter={isActive ? 'url(#glow)' : undefined}>
                <rect
                  x={node.x} y={node.y}
                  width={NODE_W} height={NODE_H}
                  rx={RADIUS} ry={RADIUS}
                  fill={nodeFill(node.status)}
                  stroke={nodeStroke(node.status)}
                  strokeWidth="1"
                />
                <text
                  x={cx} y={node.y + 30}
                  textAnchor="middle"
                  fontSize="12" fontWeight="600"
                  fontFamily="Inter, Arial, sans-serif"
                  fill={nodeTextColor(node.status)}
                >
                  {node.label}
                </text>
                <rect x={pbX} y={pbY} width={pbW} height={5} rx={2.5} fill="rgba(255,255,255,0.07)" />
                {node.progress > 0 && (
                  <rect x={pbX} y={pbY} width={pbW * (node.progress / 100)} height={5} rx={2.5} fill="#3b82f6" />
                )}
              </g>
            )
          })}
        </svg>
      </div>

    </div>
  )
}
