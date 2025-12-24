import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const watch = await prisma.watch.findUnique({
      where: { id: params.id },
    });
    
    if (!watch) {
      return NextResponse.json(
        { error: 'Watch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(watch);
  } catch (error) {
    console.error('Error fetching watch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const watch = await prisma.watch.update({
      where: { id: params.id },
      data: {
        brand: body.brand,
        model: body.model,
        referenceNumber: body.referenceNumber,
        title: body.title,
        description: body.description,
        purchasePrice: body.purchasePrice,
        revenueAsIs: body.revenueAsIs,
        revenueCleaned: body.revenueCleaned,
        revenueServiced: body.revenueServiced,
        status: body.status,
        conditionNotes: body.conditionNotes,
        notes: body.notes,
        images: body.images,
        aiAnalysis: body.aiAnalysis,
        aiRecommendation: body.aiRecommendation,
        aiConfidence: body.aiConfidence,
      },
    });
    return NextResponse.json(watch);
  } catch (error) {
    console.error('Error updating watch:', error);
    return NextResponse.json(
      { error: 'Failed to update watch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.watch.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting watch:', error);
    return NextResponse.json(
      { error: 'Failed to delete watch' },
      { status: 500 }
    );
  }
}

