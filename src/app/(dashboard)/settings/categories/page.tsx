import { prisma } from '@/lib/prisma'
import { ArrowLeft, Plus, Tag } from 'lucide-react'
import Link from 'next/link'

const typeLabel: Record<string, { label: string; class: string }> = {
  EQUIPMENT: { label: 'อุปกรณ์', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  CONSUMABLE: { label: 'วัสดุสิ้นเปลือง', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  SPARE_PART: { label: 'อะไหล่', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  TOOL: { label: 'เครื่องมือ', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  }).catch(() => [])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">หมวดหมู่</h1>
          <p className="text-slate-400 text-sm mt-0.5">{categories.length} หมวดหมู่</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4" />
          เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <Tag className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">ยังไม่มีหมวดหมู่</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">ชื่อหมวดหมู่</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">รหัส</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">ประเภท</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">อุปกรณ์</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.map((cat) => {
                const t = typeLabel[cat.type] || typeLabel.EQUIPMENT
                return (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium text-sm">{cat.name}</p>
                      {cat.description && <p className="text-slate-500 text-xs mt-0.5">{cat.description}</p>}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-slate-400 text-sm font-mono">{cat.code || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${t.class}`}>
                        {t.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-300 text-sm">{cat._count.items} รายการ</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-slate-500 hover:text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-all">
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
