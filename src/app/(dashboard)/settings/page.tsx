import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Settings, Users, Building2, Warehouse, Tag, ChevronRight } from 'lucide-react'

async function getSettingsCounts() {
  const [users, branches, warehouses, categories] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.branch.count().catch(() => 0),
    prisma.warehouse.count().catch(() => 0),
    prisma.category.count().catch(() => 0),
  ])
  return { users, branches, warehouses, categories }
}

const settingsSections = [
  {
    href: '/settings/users',
    icon: Users,
    title: 'ผู้ใช้งาน',
    description: 'จัดการบัญชีผู้ใช้, สิทธิ์, และ Role',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    key: 'users' as const,
  },
  {
    href: '/settings/branches',
    icon: Building2,
    title: 'สาขา',
    description: 'เพิ่ม/แก้ไขสาขาและที่ตั้ง',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    key: 'branches' as const,
  },
  {
    href: '/settings/warehouses',
    icon: Warehouse,
    title: 'คลังสินค้า',
    description: 'จัดการคลังสินค้าแต่ละสาขา',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    key: 'warehouses' as const,
  },
  {
    href: '/settings/categories',
    icon: Tag,
    title: 'หมวดหมู่',
    description: 'ประเภทและหมวดหมู่อุปกรณ์',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    key: 'categories' as const,
  },
]

export default async function SettingsPage() {
  const counts = await getSettingsCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ตั้งค่าระบบ</h1>
          <p className="text-slate-400 text-sm mt-0.5">จัดการข้อมูลพื้นฐานของระบบ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center gap-4 transition-all duration-150 hover:bg-slate-800/50"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${section.color}`}>
              <section.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{section.title}</p>
                <span className="text-slate-500 text-sm font-medium">{counts[section.key]} รายการ</span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">{section.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
