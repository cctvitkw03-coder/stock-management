import { prisma } from '@/lib/prisma'
import { Warehouse, Plus, CheckCircle2, XCircle, Building2, Package } from 'lucide-react'

async function getWarehouses() {
  try {
    return await prisma.warehouse.findMany({
      include: {
        branch: { select: { name: true, code: true } },
        _count: { select: { stockItems: true, receipts: true } },
      },
      orderBy: [{ branch: { name: 'asc' } }, { name: 'asc' }],
    })
  } catch {
    return []
  }
}

export default async function WarehousesPage() {
  const warehouses = await getWarehouses()

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>คลังสินค้า</h1>
          <p>จัดการคลังสินค้าแต่ละสาขา ({warehouses.length} คลัง)</p>
        </div>
        <button className="btn btn-primary" disabled>
          <Plus size={16} />
          เพิ่มคลัง
        </button>
      </div>

      {warehouses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Warehouse size={48} />
            <h3>ยังไม่มีคลังสินค้า</h3>
            <p>เพิ่มสาขาก่อน จากนั้นสร้างคลังสินค้าภายใต้สาขานั้น</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ชื่อคลัง</th>
                <th>สาขา</th>
                <th>คำอธิบาย</th>
                <th>รายการสต๊อก</th>
                <th>ใบรับเข้า</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((wh) => (
                <tr key={wh.id}>
                  <td className="td-primary">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(168,85,247,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Warehouse size={16} style={{ color: '#c084fc' }} />
                      </div>
                      {wh.name}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
                      {wh.branch.name}
                      <code style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>({wh.branch.code})</code>
                    </span>
                  </td>
                  <td>{wh.description || <span className="text-muted">—</span>}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Package size={13} style={{ color: 'var(--brand-400)' }} />
                      {wh._count.stockItems}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{wh._count.receipts}</td>
                  <td>
                    <span className={`badge ${wh.status ? 'badge-success' : 'badge-danger'}`}>
                      {wh.status ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {wh.status ? 'เปิด' : 'ปิด'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
