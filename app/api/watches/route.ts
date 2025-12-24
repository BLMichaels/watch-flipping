import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const watches = await prisma.watch.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(watches);
  } catch (error) {
    console.error('Error fetching watches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const watch = await prisma.watch.create({
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
        status: body.status || 'needs_service',
        conditionNotes: body.conditionNotes,
        notes: body.notes,
        images: body.images || [],
        ebayUrl: body.ebayUrl,
        ebayListingId: body.ebayListingId,
        aiAnalysis: body.aiAnalysis,
        aiRecommendation: body.aiRecommendation,
        aiConfidence: body.aiConfidence,
      },
    });
    return NextResponse.json(watch);
  } catch (error) {
    console.error('Error creating watch:', error);
    return NextResponse.json(
      { error: 'Failed to create watch' },
      { status: 500 }
    );
  }
}

