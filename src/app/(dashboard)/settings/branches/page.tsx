import { prisma } from '@/lib/prisma'
import { ArrowLeft, Plus, Building2 } from 'lucide-react'
import Link from 'next/link'

async function getBranches() {
  return prisma.branch.findMany({
    include: {
      _count: { select: { warehouses: true, users: true } },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function BranchesPage() {
  const branches = await getBranches()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">สาขา</h1>
          <p className="text-slate-400 text-sm mt-0.5">{branches.length} สาขา</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4" />
          เพิ่มสาขา
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-600">
            <Building2 className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">ยังไม่มีสาขา</p>
            <p className="text-sm mt-1">กดปุ่ม "เพิ่มสาขา" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${branch.status ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                  {branch.status ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-white font-semibold">{branch.name}</p>
                <p className="text-slate-500 text-xs font-mono mt-0.5">{branch.code}</p>
                {branch.address && <p className="text-slate-400 text-sm mt-2">{branch.address}</p>}
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800">
                <div className="text-center">
                  <p className="text-white font-semibold">{branch._count.warehouses}</p>
                  <p className="text-slate-500 text-xs">คลัง</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">{branch._count.users}</p>
                  <p className="text-slate-500 text-xs">ผู้ใช้</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
