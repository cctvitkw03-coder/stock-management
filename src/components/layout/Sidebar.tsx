'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Package,
  LayoutDashboard,
  PackageOpen,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  Truck,
  Wrench,
  FileText,
  BarChart3,
  Users,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'อุปกรณ์ / Asset', href: '/items', icon: PackageOpen },
  { name: 'รับเข้า', href: '/receipts', icon: ArrowDownToLine },
  { name: 'เบิกจ่าย', href: '/issues', icon: ArrowUpFromLine },
  { name: 'คืน', href: '/returns', icon: RotateCcw },
  { name: 'โอนย้าย', href: '/transfers', icon: Truck },
  { name: 'ซ่อม', href: '/repairs', icon: Wrench },
  { name: 'เอกสาร', href: '/documents', icon: FileText },
  { name: 'รายงาน', href: '/reports', icon: BarChart3 },
]

const settingsNav = [
  { name: 'ผู้ใช้งาน', href: '/settings/users', icon: Users },
  { name: 'ตั้งค่าระบบ', href: '/settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Stock & Asset</p>
              <p className="text-slate-500 text-xs">Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto py-4">
          <nav className="px-3 space-y-0.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 py-2">
              เมนูหลัก
            </p>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-cyan-500/10 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />}
                </Link>
              )
            })}
          </nav>

          <div className="px-3 mt-4 space-y-0.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 py-2">
              จัดการระบบ
            </p>
            {settingsNav.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />}
                </Link>
              )
            })}
          </div>

          {/* Version */}
          <div className="mt-auto px-5 py-4">
            <p className="text-slate-600 text-xs">v1.0.0 — Phase 1</p>
          </div>
        </div>
      </aside>
    </>
  )
}
