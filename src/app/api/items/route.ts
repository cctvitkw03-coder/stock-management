import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined

  try {
    const items = await prisma.item.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { itemCode: { contains: search, mode: 'insensitive' } },
        ]
      } : {},
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await prisma.item.create({
      data: {
        itemCode: body.itemCode,
        name: body.name,
        categoryId: body.categoryId || undefined,
        brand: body.brand || undefined,
        model: body.model || undefined,
        unit: body.unit || 'ชิ้น',
        trackingType: body.trackingType || 'QUANTITY',
        minimumStock: body.minimumStock || 0,
        description: body.description || undefined,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'รหัสอุปกรณ์ซ้ำ' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
