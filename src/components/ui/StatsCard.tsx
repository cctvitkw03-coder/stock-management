import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: 'cyan' | 'blue' | 'amber' | 'red' | 'green' | 'purple'
  trend?: { value: number; label: string }
}

const colorMap = {
  cyan: {
    bg: 'bg-cyan-500/10',
    icon: 'text-cyan-400',
    border: 'border-cyan-500/20',
    glow: 'shadow-cyan-500/5',
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/5',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    border: 'border-red-500/20',
    glow: 'shadow-red-500/5',
  },
  green: {
    bg: 'bg-green-500/10',
    icon: 'text-green-400',
    border: 'border-green-500/20',
    glow: 'shadow-green-500/5',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/20',
    glow: 'shadow-purple-500/5',
  },
}

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const c = colorMap[color]

  return (
    <div className={`bg-slate-900 border ${c.border} rounded-2xl p-5 shadow-lg ${c.glow} hover:border-opacity-50 transition-all duration-200 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={`${c.bg} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  )
}
