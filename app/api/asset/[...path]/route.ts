
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathSegments } = await params;

    // Clean the path to prevent traversal attacks
    const safePath = pathSegments.join('/').replace(/\.\./g, '');

    const assetPath = path.join(process.cwd(), 'assets', safePath);

    if (!fs.existsSync(assetPath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(assetPath);
    const contentType = mime.getType(safePath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
