/**
 * Turning a chosen file into something this prototype can actually keep.
 *
 * There is no backend and no file store, so an added photo has to live in
 * `localStorage` as a data URL — and `localStorage` is about 5 MB per origin,
 * shared with the audit log and every other override. A 3 MB phone photo
 * base64-encodes to roughly 4 MB and fills it on its own.
 *
 * So a file is redrawn through a canvas before it is stored: long edge capped,
 * re-encoded as JPEG. A 4000px camera photo lands around 150–250 KB, which
 * leaves room for a demo's worth of them.
 *
 * A real deployment would upload the original and serve derivatives. This is
 * the prototype's honest substitute, not a pattern to copy into production.
 */

/** Long edge, in CSS pixels. Enough for the public hero at 2× on a laptop. */
const MAX_EDGE = 1200
const QUALITY = 0.78

export type PreparedPhoto = {
  dataUrl: string
  /** Bytes the string will occupy, so a caller can refuse before it writes. */
  bytes: number
  width: number
  height: number
}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas itu bukan gambar.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Browser ini tidak bisa memproses gambar.')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // JPEG regardless of what came in: PNG screenshots of rooms are common and
  // encode enormously, and none of this needs transparency.
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)

  return { dataUrl, bytes: dataUrl.length, width, height }
}

/** Human-readable, for the one place a manager needs to see it. */
export const formatBytes = (bytes: number) =>
  bytes > 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
