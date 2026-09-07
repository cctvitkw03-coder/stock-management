import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, QrCode, MapPin, User } from 'lucide-react'

const statusLabel: Record<string, { label: string; class: string }> = {
  IN_STOCK: { label: 'อยู่ในสต๊อก', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
  READY: { label: 'พร้อมจ่าย', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  IN_USE: { label: 'เบิกใช้งาน', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  BORROWED: { label: 'ยืม', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  PENDING_RETURN: { label: 'รอคืน', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  IN_REPAIR: { label: 'ส่งซ่อม', class: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  DAMAGED: { label: 'ชำรุด', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  LOST: { label: 'สูญหาย', class: 'bg-red-700/20 text-red-300 border-red-700/30' },
  TRANSFERRED: { label: 'โอนย้าย', class: 'bg-slate-700 text-slate-300 border-slate-600' },
  DISPOSED: { label: 'จำหน่าย', class: 'bg-slate-800 text-slate-500 border-slate-700' },
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      assets: {
        include: {
          currentUser: { select: { name: true, employeeId: true } },
          currentBranch: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      stockItems: {
        include: { warehouse: { include: { branch: { select: { name: true } } } } },
      },
    },
  }).catch(() => null)

  if (!item) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/items" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{item.name}</h1>
            <span className="text-slate-500 text-sm font-mono bg-slate-800 px-2.5 py-1 rounded-lg">{item.itemCode}</span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {[item.category?.name, item.brand, item.model].filter(Boolean).join(' • ')}
          </p>
        </div>
        <button className="flex items-center gap-2 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 px-4 py-2.5 rounded-xl text-sm transition-colors">
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Asset ทั้งหมด', value: item.assets.length, icon: '📦' },
          { label: 'หน่วยนับ', value: item.unit, icon: '📏' },
          { label: 'ติดตามแบบ', value: item.trackingType === 'SERIAL' ? 'Serial No.' : 'จำนวน', icon: '🔍' },
          { label: 'สต๊อกขั้นต่ำ', value: item.minimumStock, icon: '⚠️' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {item.stockItems.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">สต๊อกตามคลัง</h2>
          <div className="space-y-2">
            {item.stockItems.map((stock) => (
              <div key={stock.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-slate-300 text-sm font-medium">{stock.warehouse.name}</p>
                  <p className="text-slate-500 text-xs">{stock.warehouse.branch?.name}</p>
                </div>
                <span className="text-white font-bold">{stock.quantity.toLocaleString()} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.assets.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">รายการ Asset ({item.assets.length})</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Asset Code / Serial</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">ผู้ถือครอง</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">สาขา</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {item.assets.map((asset) => {
                const s = statusLabel[asset.status] || statusLabel['IN_STOCK']
                return (
                  <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white text-sm font-mono">{asset.assetCode}</p>
                      {asset.serialNumber && <p className="text-slate-500 text-xs mt-0.5">S/N: {asset.serialNumber}</p>}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-400 text-sm">{asset.currentUser?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-400 text-sm">{asset.currentBranch?.name || asset.currentLocation || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${s.class}`}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
