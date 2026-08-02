'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImagePlus, ImageOff, Star, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import type { Building, BuildingPhoto } from '@/lib/content/management/buildings'
import { formatBytes, preparePhoto } from '@/lib/management/image'
import { addPhoto, removePhoto, setCover, setPhotoLabel } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'

/** Enough to fill a gallery; few enough to stay inside the storage budget. */
const MAX_PHOTOS = 6

/**
 * The building's photographs.
 *
 * The handoff bundle designs no screen for this, so the interaction is borrowed
 * from the one beside it: the floor grid. Pick a tile, and its actions appear
 * underneath. Hover-revealed controls would have been shorter to write and
 * unreachable by touch or keyboard, and this page already taught the reader
 * that selecting a thing is how you act on it.
 *
 * Cover is simply the first photo, so "Jadikan sampul" is a reorder rather than
 * a flag that could disagree with the order. It is what the property card and
 * the search result show, and the note says so — a manager should not have to
 * discover where a photo ends up.
 *
 * The prototype has no file store, so an added file is redrawn smaller and kept
 * as a data URL. `lib/management/image.ts` explains the sizes; what matters here
 * is that the write can fail on a full quota, and when it does the manager is
 * told rather than left with a photo that disappears on reload.
 */
export function PhotoPanel({ building }: { building: Building }) {
  const { apply, actor } = useManagement()
  const { show } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [renaming, setRenaming] = useState(false)
  const [label, setLabel] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)

  const photos = building.photos
  const selected = photos.find((p) => p.id === selectedId) ?? null
  const full = photos.length >= MAX_PHOTOS

  // The preview falls back to the cover, so the panel always shows what the
  // property card is currently showing rather than an empty frame.
  const previewed = selected ?? photos[0] ?? null
  const isCover = previewed?.id === photos[0]?.id

  const recorded = `Tercatat atas ${actor}`

  const ingest = async (files: FileList | null) => {
    if (!files?.length) return
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) {
      show({
        title: `Sudah ada ${MAX_PHOTOS} foto`,
        detail: 'Hapus salah satu sebelum menambah yang baru.',
        icon: ImageOff,
        tone: 'attention',
      })
      return
    }

    setBusy(true)
    try {
      for (const file of Array.from(files).slice(0, room)) {
        const prepared = await preparePhoto(file)
        const photo: BuildingPhoto = {
          id: `${building.number}-${file.name}-${prepared.bytes}`,
          src: prepared.dataUrl,
          // The filename minus its extension is a better first guess than
          // "Foto 3", and it is editable straight away.
          label: file.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Foto gedung',
        }
        const ok = apply((s) => addPhoto(s, building.number, photo))

        if (!ok) {
          show({
            title: 'Foto tidak bisa disimpan',
            detail:
              'Penyimpanan browser penuh. Hapus beberapa foto atau tekan “Atur ulang data demo”.',
            icon: ImageOff,
            tone: 'attention',
          })
          return
        }

        show({
          title: `Foto ditambahkan — ${photo.label}`,
          detail: `${prepared.width}×${prepared.height} · ${formatBytes(prepared.bytes)} · ${recorded}`,
          icon: ImagePlus,
          action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
        })
        setSelectedId(photo.id)
      }
    } catch (error) {
      show({
        title: 'Foto tidak bisa dibaca',
        detail: error instanceof Error ? error.message : 'Coba berkas gambar lain.',
        icon: ImageOff,
        tone: 'attention',
      })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionLabel>Foto gedung</SectionLabel>
          <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft">
            Yang pertama jadi sampul — muncul di kartu properti dan hasil pencarian. Sisanya masuk
            galeri di halaman detail.
          </p>
        </div>
        <span className="text-[13px] whitespace-nowrap text-ink-soft">
          {photos.length}/{MAX_PHOTOS}
        </span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => ingest(e.target.files)}
      />

      {previewed && (
        /* Large, and inline rather than in a lightbox. A modal needs a focus
           trap, an escape route and a scroll lock to be correct, and the
           manager is mid-task; this page already teaches that selecting a thing
           reveals it. */
        <figure className="mt-5">
          <div className="relative aspect-3/2 overflow-hidden rounded-card bg-photo-bg">
            <Image
              src={previewed.src}
              alt={previewed.label}
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              unoptimized={previewed.src.startsWith('data:')}
              className="object-cover"
            />
          </div>

          <figcaption className="mt-3 flex items-start gap-3">
            {/* The same file, rendered at the crop the property card uses.
                One photograph appears in three shapes publicly — square on the
                card, 4:3 in a search result, 3:2 in the gallery — and a
                landscape shot can lose its subject to the square. Rendered
                rather than drawn as a guide, so it is exact for any photo. */}
            <span className="relative size-16 shrink-0 overflow-hidden rounded-badge bg-photo-bg">
              <Image
                src={previewed.src}
                alt=""
                fill
                sizes="64px"
                unoptimized={previewed.src.startsWith('data:')}
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] leading-[1.35] font-semibold">
                {previewed.label}
              </span>
              <span className="mt-0.5 block text-[12px] leading-[1.5] text-ink-soft">
                {isCover
                  ? 'Besar: galeri halaman detail. Kotak kecil: potongan di kartu properti.'
                  : 'Belum jadi sampul — hanya muncul di galeri halaman detail.'}
              </span>
            </span>
          </figcaption>
        </figure>
      )}

      {photos.length > 0 ? (
        <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <li key={photo.id}>
              <Thumb
                photo={photo}
                isCover={i === 0}
                selected={photo.id === selectedId}
                onSelect={() => {
                  setSelectedId(photo.id === selectedId ? null : photo.id)
                  setRenaming(false)
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        // Empty is a real state here — three of the six buildings have no
        // photographs at all — so it names what is missing and what to do,
        // rather than saying "tidak ada data".
        <DropZone
          dragging={dragging}
          setDragging={setDragging}
          onFiles={ingest}
          onBrowse={() => fileRef.current?.click()}
          busy={busy}
          empty
        />
      )}

      {photos.length > 0 && (
        <div className="mt-4">
          <DropZone
            dragging={dragging}
            setDragging={setDragging}
            onFiles={ingest}
            onBrowse={() => fileRef.current?.click()}
            busy={busy}
            disabled={full}
          />
        </div>
      )}

      {selected && (
        <div className="mt-5 border-t border-line pt-5">
          <p className="text-[14px] font-semibold">{selected.label}</p>

          {renaming ? (
            <form
              className="mt-3 flex flex-wrap items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const next = label.trim()
                if (!next || next === selected.label) return setRenaming(false)
                apply((s) => setPhotoLabel(s, building.number, selected, next))
                show({
                  title: `Nama foto jadi “${next}”`,
                  detail: recorded,
                  icon: Tag,
                  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
                })
                setRenaming(false)
              }}
            >
              <label className="min-w-0 flex-1 basis-52">
                <span className="mb-1.5 block text-[13px] font-semibold">Nama foto</span>
                <input
                  autoFocus
                  required
                  maxLength={40}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="mis. Tampak depan"
                  className="w-full rounded-badge border border-line bg-paper px-3 py-2.5 text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
                />
                <span className="mt-1.5 block text-[12px] text-ink-soft">
                  Tampil di bawah galeri halaman publik.
                </span>
              </label>
              <div className="flex gap-2">
                <Button size="sm" type="submit">
                  Simpan
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setRenaming(false)}>
                  Batal
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={selected.id === photos[0]?.id}
                onClick={() => {
                  apply((s) => setCover(s, building.number, selected))
                  show({
                    title: `“${selected.label}” jadi sampul`,
                    detail: `Kartu properti dan hasil pencarian ikut berubah · ${recorded}`,
                    icon: Star,
                    action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
                  })
                }}
              >
                <Star size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                {selected.id === photos[0]?.id ? 'Sudah jadi sampul' : 'Jadikan sampul'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setLabel(selected.label)
                  setRenaming(true)
                }}
              >
                <Tag size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                Ganti nama
              </Button>

              <Button
                variant="warn"
                size="sm"
                onClick={() => {
                  apply((s) => removePhoto(s, building.number, selected))
                  setSelectedId(null)
                  show({
                    title: `Foto “${selected.label}” dihapus`,
                    detail:
                      photos[0]?.id === selected.id && photos[1]
                        ? `“${photos[1].label}” jadi sampul · ${recorded}`
                        : recorded,
                    icon: Trash2,
                    tone: 'attention',
                    action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
                  })
                }}
              >
                <Trash2 size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function Thumb({
  photo,
  isCover,
  selected,
  onSelect,
}: {
  photo: BuildingPhoto
  isCover: boolean
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'relative block aspect-square w-full cursor-pointer overflow-hidden rounded-badge bg-photo-bg transition-[outline] duration-150',
        selected ? 'outline-2 outline-offset-2 outline-plum' : 'outline-0 outline-transparent',
      )}
    >
      <Image
        src={photo.src}
        alt={photo.label}
        fill
        sizes="160px"
        unoptimized={photo.src.startsWith('data:')}
        className="object-cover"
      />
      {isCover && (
        // The cover is a fact about this photo, so it is stated on it rather
        // than left to the reader to infer from position.
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-badge bg-ink/80 px-1.5 py-0.5 text-[11px] font-semibold text-stone">
          <Star size={11} strokeWidth={2.5} aria-hidden />
          Sampul
        </span>
      )}
    </button>
  )
}

function DropZone({
  dragging,
  setDragging,
  onFiles,
  onBrowse,
  busy,
  disabled,
  empty,
}: {
  dragging: boolean
  setDragging: (v: boolean) => void
  onFiles: (files: FileList | null) => void
  onBrowse: () => void
  busy: boolean
  disabled?: boolean
  empty?: boolean
}) {
  return (
    <div
      onDragOver={(e) => {
        if (disabled) return
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) onFiles(e.dataTransfer.files)
      }}
      className={cn(
        'rounded-card border border-dashed text-center transition-colors',
        empty ? 'mt-5 px-6 py-10' : 'px-5 py-5',
        dragging && !disabled ? 'border-plum bg-plum-soft/40' : 'border-line',
        disabled && 'opacity-55',
      )}
    >
      {empty && <p className="text-[15px] font-semibold">Belum ada foto gedung ini.</p>}
      <p
        className={cn(
          'text-[13px] leading-[1.6] text-ink-soft',
          empty && 'mx-auto mt-2 max-w-[42ch]',
        )}
      >
        {disabled
          ? 'Batas foto tercapai. Hapus salah satu untuk menambah yang baru.'
          : empty
            ? 'Kartu properti menampilkan nomor rumah selama foto belum ada. Tarik gambar ke sini, atau pilih dari perangkat.'
            : 'Tarik gambar ke sini, atau pilih dari perangkat.'}
      </p>
      <div className={cn(empty ? 'mt-4' : 'mt-3')}>
        <Button size="sm" variant="secondary" disabled={disabled || busy} onClick={onBrowse}>
          <ImagePlus size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
          {busy ? 'Memproses…' : 'Pilih foto'}
        </Button>
      </div>
    </div>
  )
}
