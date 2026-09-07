import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Search, Filter, PackageOpen, QrCode } from 'lucide-react'

async function getItems(search?: string) {
  return prisma.item.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { itemCode: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    } : {},
    include: {
      category: { select: { name: true } },
      _count: { select: { assets: true, stockItems: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

const trackingBadge = {
  SERIAL: { label: 'Serial', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  QUANTITY: { label: 'จำนวน', class: 'bg-slate-700 text-slate-300 border-slate-600' },
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const items = await getItems(search)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">อุปกรณ์ / Asset</h1>
          <p className="text-slate-400 text-sm mt-1">{items.length} รายการ</p>
        </div>
        <Link
          href="/items/new"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          เพิ่มอุปกรณ์
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <form className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="search"
            defaultValue={search}
            placeholder="ค้นหาชื่อ, รหัส, ยี่ห้อ..."
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </form>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Filter className="w-4 h-4" />
          กรอง
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <PackageOpen className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">ยังไม่มีรายการอุปกรณ์</p>
            <p className="text-sm mt-1">เริ่มต้นโดยกดปุ่ม "เพิ่มอุปกรณ์"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">รหัส / ชื่อ</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">หมวดหมู่</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">ยี่ห้อ / รุ่น</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">ติดตาม</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">Asset</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">สถานะ</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item) => {
                  const badge = trackingBadge[item.trackingType]
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-white font-medium text-sm">{item.name}</p>
                          <p className="text-slate-500 text-xs mt-0.5 font-mono">{item.itemCode}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-slate-400 text-sm">{item.category?.name || '-'}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-slate-400 text-sm">{[item.brand, item.model].filter(Boolean).join(' / ') || '-'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-slate-300 text-sm">{item._count.assets.toLocaleString()} ชิ้น</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${item.status ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {item.status ? 'ใช้งาน' : 'ปิดใช้'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/items/${item.id}`}
                            className="text-slate-400 hover:text-cyan-400 transition-colors text-xs font-medium"
                          >
                            ดูรายละเอียด
                          </Link>
                          <button className="text-slate-500 hover:text-slate-300 transition-colors">
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
