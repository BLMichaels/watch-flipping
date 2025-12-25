import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${params.id}-${Date.now()}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Get current watch to update images array
    const watch = await prisma.watch.findUnique({
      where: { id: params.id },
    });

    if (!watch) {
      return NextResponse.json({ error: 'Watch not found' }, { status: 404 });
    }

    // Add new image URL to images array
    const imageUrl = `/uploads/${filename}`;
    const updatedImages = [...watch.images, imageUrl];

    // Update watch with new image
    await prisma.watch.update({
      where: { id: params.id },
      data: { images: updatedImages },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Note: For production on Vercel, consider using cloud storage (AWS S3, Cloudinary, or Vercel Blob)
// as serverless functions have ephemeral filesystems. This implementation works for development/testing.

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Get current watch
    const watch = await prisma.watch.findUnique({
      where: { id: params.id },
    });

    if (!watch) {
      return NextResponse.json({ error: 'Watch not found' }, { status: 404 });
    }

    // Remove image from array
    const updatedImages = watch.images.filter((img) => img !== imageUrl);

    // Update watch
    await prisma.watch.update({
      where: { id: params.id },
      data: { images: updatedImages },
    });

    // Optionally delete the file from filesystem
    // (commented out for safety - uncomment if you want to delete files)
    // const filepath = join(process.cwd(), 'public', imageUrl);
    // if (existsSync(filepath)) {
    //   await unlink(filepath);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

