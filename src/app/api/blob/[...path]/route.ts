// app/api/blob/[...path]/route.ts
// GET /api/blob/uploads/<pasta>/<arquivo> → serve uma imagem do Vercel Blob (store privado).
// O store não tem URL pública; só o servidor tem o BLOB_READ_WRITE_TOKEN, então toda
// leitura passa por aqui (ver src/lib/content/images.ts).
import { get } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";

import { clientIp, rateLimit } from "@/lib/security/request-guard";

export const dynamic = "force-dynamic";

// Mesmo formato de path gerado em uploadImage: uploads/<pasta>/<uuid>.<ext>
const PATH_PATTERN =
  /^uploads\/(journey|posts|projects|resume)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  // São imagens públicas do site (capas, logos, certificados): qualquer visitante pode
  // ler. O limite é só para não deixar um cliente sozinho martelar o Blob de origem.
  if (!rateLimit(`blob:${clientIp(request.headers)}`, 300, 60 * 1000).allowed) {
    return new NextResponse(null, { status: 429 });
  }

  const { path } = await params;
  const pathname = path.join("/");
  if (!PATH_PATTERN.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  let result;
  try {
    result = await get(pathname, { access: "private" });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(result.stream, {
    status: 200,
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
