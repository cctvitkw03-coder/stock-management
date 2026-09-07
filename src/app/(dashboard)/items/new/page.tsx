'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

export default function NewItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    itemCode: '',
    name: '',
    categoryId: '',
    brand: '',
    model: '',
    unit: 'ชิ้น',
    trackingType: 'QUANTITY',
    minimumStock: 0,
    description: '',
  })

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/items')
        router.refresh()
      }
    } catch {
      setLoading(false)
    }
  }

  const field = (label: string, children: React.ReactNode, required = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )

  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/items" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">เพิ่มอุปกรณ์ใหม่</h1>
          <p className="text-slate-400 text-sm mt-1">กรอกข้อมูลอุปกรณ์ที่ต้องการเพิ่ม</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          {field('รหัสอุปกรณ์', (
            <input
              value={form.itemCode}
              onChange={e => setForm({ ...form, itemCode: e.target.value })}
              placeholder="เช่น IT-000001"
              className={inputClass}
              required
            />
          ), true)}
          {field('ชื่ออุปกรณ์', (
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น Notebook Lenovo"
              className={inputClass}
              required
            />
          ), true)}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {field('หมวดหมู่', (
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className={inputClass}
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          ))}
          {field('หน่วยนับ', (
            <input
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              placeholder="ชิ้น, อัน, ตัว..."
              className={inputClass}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {field('ยี่ห้อ', (
            <input
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              placeholder="เช่น Lenovo, HP, Dell"
              className={inputClass}
            />
          ))}
          {field('รุ่น', (
            <input
              value={form.model}
              onChange={e => setForm({ ...form, model: e.target.value })}
              placeholder="เช่น ThinkPad X1"
              className={inputClass}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {field('ประเภทการติดตาม', (
            <select
              value={form.trackingType}
              onChange={e => setForm({ ...form, trackingType: e.target.value })}
              className={inputClass}
            >
              <option value="QUANTITY">จำนวน (ไม่มี Serial)</option>
              <option value="SERIAL">Serial Number (ติดตามรายชิ้น)</option>
            </select>
          ))}
          {field('สต๊อกขั้นต่ำ', (
            <input
              type="number"
              min={0}
              value={form.minimumStock}
              onChange={e => setForm({ ...form, minimumStock: parseInt(e.target.value) || 0 })}
              className={inputClass}
            />
          ))}
        </div>

        {field('หมายเหตุ / คำอธิบาย', (
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="รายละเอียดเพิ่มเติม..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        ))}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/items"
            className="flex-1 text-center py-2.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl text-sm font-medium transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  )
}
