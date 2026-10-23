// lib/content/images.ts
// Upload de imagens para o Vercel Blob com validação por assinatura binária.
import "server-only";

import { del, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

// Mesmo teto do limite combinado por salvamento (MAX_UPLOAD_BYTES_PER_SAVE em
// actions.ts): mais que isso não caberia de qualquer forma no limite de
// requisição da Vercel (4,5 MB).
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

// SVG fica de fora de propósito: pode carregar scripts (XSS).
const SIGNATURES: { mime: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: "image/png",
    ext: "png",
    test: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      String.fromCharCode(...b.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  },
  {
    mime: "image/avif",
    ext: "avif",
    test: (b) => String.fromCharCode(...b.slice(4, 12)) === "ftypavif",
  },
];

export type ImageValidation =
  | { ok: true; file: File | null }
  | { ok: false; error: string };

/** Aceita campo vazio (nenhuma imagem nova) ou uma imagem válida. */
export function readImageField(value: FormDataEntryValue | null): ImageValidation {
  if (!value || typeof value === "string" || value.size === 0) {
    return { ok: true, file: null };
  }
  if (value.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "A imagem deve ter no máximo 4 MB" };
  }
  return { ok: true, file: value };
}

export async function uploadImage(
  file: File,
  folder: "journey" | "posts" | "projects" | "resume"
): Promise<{ url: string; path: string }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = SIGNATURES.find((signature) => signature.test(bytes));
  if (!kind) {
    throw new InvalidImageError("Formato não suportado. Use JPG, PNG, WebP ou AVIF.");
  }

  const path = `uploads/${folder}/${randomUUID()}.${kind.ext}`;

  const blob = await put(path, Buffer.from(bytes), {
    access: "private",
    addRandomSuffix: false, // o path já é único (randomUUID acima)
    contentType: kind.mime, // tipo detectado, nunca o informado pelo navegador
    cacheControlMaxAge: 31536000,
  });

  // O store é privado (sem URL pública direta); a leitura passa pela rota
  // /api/blob/[...path], que busca o conteúdo com o token do servidor. URL
  // relativa: funciona direto com <Image>/<img>, sem precisar saber o host.
  return { url: `/api/blob/${blob.pathname}`, path: blob.pathname };
}

export async function deleteImage(path: string | undefined): Promise<void> {
  if (!path?.startsWith("uploads/")) return;
  try {
    await del(path);
  } catch (error) {
    console.error("Erro ao remover imagem:", error);
  }
}

export class InvalidImageError extends Error {}
