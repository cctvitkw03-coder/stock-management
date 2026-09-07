import { prisma } from '@/lib/prisma'
import { ArrowLeft, Plus, Users, Shield } from 'lucide-react'
import Link from 'next/link'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Admin': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'ผู้อนุมัติ': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'ผู้จ่าย': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'พนักงาน': 'bg-slate-700 text-slate-300 border-slate-600',
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      role: { select: { name: true } },
      branch: { select: { name: true } },
      department: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">ผู้ใช้งาน</h1>
          <p className="text-slate-400 text-sm mt-0.5">{users.length} บัญชี</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4" />
          เพิ่มผู้ใช้
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <Users className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">ยังไม่มีผู้ใช้งาน</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">ชื่อ / รหัส</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">แผนก / สาขา</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Role</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => {
                const roleColor = roleColors[user.role?.name || ''] || roleColors['พนักงาน']
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{user.name}</p>
                          <p className="text-slate-500 text-xs font-mono">{user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-slate-400 text-sm">{user.department?.name || '-'}</p>
                      <p className="text-slate-500 text-xs">{user.branch?.name || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${roleColor}`}>
                        <Shield className="w-3 h-3" />
                        {user.role?.name || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                        {user.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                      </span>
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
