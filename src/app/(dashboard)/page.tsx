import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/ui/StatsCard'
import {
  PackageOpen,
  Boxes,
  ArrowUpFromLine,
  Wrench,
  AlertTriangle,
  Clock,
  FileSignature,
  Truck,
  TrendingUp,
} from 'lucide-react'

async function getDashboardStats() {
  try {
    const [
      totalItems,
      totalAssets,
      inStockAssets,
      inUseAssets,
      inRepairAssets,
      damagedAssets,
      pendingIssues,
      pendingTransfers,
    ] = await Promise.all([
      prisma.item.count({ where: { status: true } }),
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'IN_STOCK' } }),
      prisma.asset.count({ where: { status: 'IN_USE' } }),
      prisma.asset.count({ where: { status: 'IN_REPAIR' } }),
      prisma.asset.count({ where: { status: 'DAMAGED' } }),
      prisma.issueRequest.count({ where: { status: { in: ['DRAFT', 'PENDING_SIGN'] } } }),
      prisma.transfer.count({ where: { status: { in: ['PENDING', 'IN_TRANSIT'] } } }),
    ])

    return {
      totalItems,
      totalAssets,
      inStockAssets,
      inUseAssets,
      inRepairAssets,
      damagedAssets,
      pendingIssues,
      pendingTransfers,
    }
  } catch {
    return {
      totalItems: 0, totalAssets: 0, inStockAssets: 0,
      inUseAssets: 0, inRepairAssets: 0, damagedAssets: 0,
      pendingIssues: 0, pendingTransfers: 0,
    }
  }
}

async function getRecentActivities() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, employeeId: true } } },
    })
    return logs
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const activities = await getRecentActivities()

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'อรุณสวัสดิ์' : now.getHours() < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{greeting} 👋</h1>
        <p className="text-slate-400 mt-1 text-sm">
          ภาพรวมระบบบริหารสต๊อกและอุปกรณ์ — {now.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="รายการอุปกรณ์"
          value={stats.totalItems}
          subtitle="ประเภทอุปกรณ์ทั้งหมด"
          icon={PackageOpen}
          color="cyan"
        />
        <StatsCard
          title="Asset ทั้งหมด"
          value={stats.totalAssets}
          subtitle="รายการที่มี Serial/Asset No."
          icon={Boxes}
          color="blue"
        />
        <StatsCard
          title="อยู่ในสต๊อก"
          value={stats.inStockAssets}
          subtitle="พร้อมใช้งาน"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="เบิกใช้งาน"
          value={stats.inUseAssets}
          subtitle="กำลังใช้งานอยู่"
          icon={ArrowUpFromLine}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ส่งซ่อม"
          value={stats.inRepairAssets}
          icon={Wrench}
          color="amber"
        />
        <StatsCard
          title="ชำรุด"
          value={stats.damagedAssets}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="ใบเบิกรออนุมัติ"
          value={stats.pendingIssues}
          icon={FileSignature}
          color="cyan"
        />
        <StatsCard
          title="โอนย้ายรอรับ"
          value={stats.pendingTransfers}
          icon={Truck}
          color="blue"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">กิจกรรมล่าสุด</h2>
            <span className="text-xs text-slate-500">Audit Log</span>
          </div>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <Clock className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">ยังไม่มีกิจกรรม</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 text-xs font-bold">
                    {log.user.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm font-medium">{log.user.name || log.user.employeeId}</p>
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{log.description || log.action}</p>
                  </div>
                  <p className="text-slate-600 text-xs flex-shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">ทำรายการด่วน</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'สร้างใบรับเข้า', href: '/receipts/new', icon: '📥', color: 'hover:border-cyan-500/40 hover:bg-cyan-500/5' },
              { label: 'สร้างใบเบิก', href: '/issues/new', icon: '📤', color: 'hover:border-blue-500/40 hover:bg-blue-500/5' },
              { label: 'แจ้งซ่อม', href: '/repairs/new', icon: '🔧', color: 'hover:border-amber-500/40 hover:bg-amber-500/5' },
              { label: 'โอนย้าย', href: '/transfers/new', icon: '🚚', color: 'hover:border-purple-500/40 hover:bg-purple-500/5' },
              { label: 'เพิ่มอุปกรณ์', href: '/items/new', icon: '➕', color: 'hover:border-green-500/40 hover:bg-green-500/5' },
              { label: 'ดูรายงาน', href: '/reports', icon: '📊', color: 'hover:border-slate-500/40 hover:bg-slate-700/30' },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`border border-slate-800 rounded-xl p-3.5 text-center transition-all duration-150 cursor-pointer ${action.color} group`}
              >
                <span className="text-2xl block mb-1.5 group-hover:scale-110 transition-transform duration-150">{action.icon}</span>
                <span className="text-slate-300 text-xs font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
