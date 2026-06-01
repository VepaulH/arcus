'use client'

const NODE_W = 160
const NODE_H = 78
const RADIUS = 12
const SVG_W = 1865
const SVG_H = 460

type Status = 'active' | 'available' | 'locked'

interface RoadmapNode {
  id: string
  label: string
  x: number
  y: number
  status: Status
  progress: number
}

interface RoadmapEdge {
  from: string
  to: string
}

const nodes: RoadmapNode[] = [
  { id: 'ideation',    label: 'Ideation',             x: 40,   y: 210, status: 'active',    progress: 0 },
  { id: 'market',      label: 'Market Research',       x: 310,  y: 90,  status: 'available', progress: 0 },
  { id: 'problem',     label: 'Problem Statement',     x: 310,  y: 330, status: 'available', progress: 0 },
  { id: 'competitor',  label: 'Competitor Analysis',   x: 580,  y: 90,  status: 'locked',    progress: 0 },
  { id: 'discovery',   label: 'Customer Discovery',    x: 580,  y: 330, status: 'locked',    progress: 0 },
  { id: 'psfit',       label: 'Problem-Solution Fit',  x: 850,  y: 210, status: 'locked',    progress: 0 },
  { id: 'bizmodel',    label: 'Business Model',        x: 1120, y: 90,  status: 'locked',    progress: 0 },
  { id: 'mvp',         label: 'MVP Development',       x: 1120, y: 330, status: 'locked',    progress: 0 },
  { id: 'launch',      label: 'Launch',                x: 1390, y: 210, status: 'locked',    progress: 0 },
  { id: 'pmfit',       label: 'Product-Market Fit',    x: 1660, y: 90,  status: 'locked',    progress: 0 },
  { id: 'fundraising', label: 'Fundraising',           x: 1660, y: 330, status: 'locked',    progress: 0 },
]

const edges: RoadmapEdge[] = [
  { from: 'ideation',   to: 'market' },
  { from: 'ideation',   to: 'problem' },
  { from: 'market',     to: 'competitor' },
  { from: 'market',     to: 'discovery' },
  { from: 'problem',    to: 'discovery' },
  { from: 'competitor', to: 'psfit' },
  { from: 'discovery',  to: 'psfit' },
  { from: 'psfit',      to: 'bizmodel' },
  { from: 'psfit',      to: 'mvp' },
  { from: 'bizmodel',   to: 'launch' },
  { from: 'mvp',        to: 'launch' },
  { from: 'launch',     to: 'pmfit' },
  { from: 'launch',     to: 'fundraising' },
]

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

function edgePath(fromId: string, toId: string) {
  const src = nodeMap[fromId]
  const tgt = nodeMap[toId]
  const sx = src.x + NODE_W
  const sy = src.y + NODE_H / 2
  const ex = tgt.x
  const ey = tgt.y + NODE_H / 2
  const dx = (ex - sx) / 2
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
}

function nodeFill(status: Status) {
  if (status === 'active')    return 'url(#activeGrad)'
  if (status === 'available') return 'url(#availableGrad)'
  return 'rgba(255,255,255,0.04)'
}

function nodeStroke(status: Status) {
  if (status === 'active')    return 'rgba(99,155,255,0.7)'
  if (status === 'available') return 'rgba(59,130,246,0.3)'
  return 'rgba(255,255,255,0.08)'
}

function nodeTextColor(status: Status) {
  if (status === 'locked') return 'rgba(148,163,184,0.55)'
  if (status === 'available') return '#93c5fd'
  return '#ffffff'
}

export default function RoadmapPage() {
  return (
    <div className="px-6 py-20">

      {/* Hero */}
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
          Your path forward
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Startup Roadmap
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          A dependency graph for building your startup. Complete each stage
          to unlock the next. Follow the path from idea to growth.
        </p>
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
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="availableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a6e" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 8 4, 0 8" fill="rgba(255,255,255,0.22)" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => (
            <path
              key={i}
              d={edgePath(e.from, e.to)}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          ))}

          {/* Nodes */}
          {nodes.map(node => {
            const cx = node.x + NODE_W / 2
            const pbX = node.x + 18
            const pbW = NODE_W - 36
            const pbY = node.y + NODE_H - 20
            const isActive = node.status === 'active'

            return (
              <g key={node.id} style={{ cursor: 'pointer' }} filter={isActive ? 'url(#glow)' : undefined}>
                {/* Box */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={RADIUS}
                  ry={RADIUS}
                  fill={nodeFill(node.status)}
                  stroke={nodeStroke(node.status)}
                  strokeWidth="1"
                />

                {/* Label */}
                <text
                  x={cx}
                  y={node.y + 30}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, Arial, sans-serif"
                  fill={nodeTextColor(node.status)}
                >
                  {node.label}
                </text>

                {/* Progress bar track */}
                <rect
                  x={pbX}
                  y={pbY}
                  width={pbW}
                  height={5}
                  rx={2.5}
                  fill="rgba(255,255,255,0.07)"
                />

                {/* Progress bar fill */}
                {node.progress > 0 && (
                  <rect
                    x={pbX}
                    y={pbY}
                    width={pbW * (node.progress / 100)}
                    height={5}
                    rx={2.5}
                    fill="#3b82f6"
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>

    </div>
  )
}
