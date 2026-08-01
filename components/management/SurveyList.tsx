'use client'

import { useState } from 'react'
import { CalendarCheck, CalendarX, Check, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { buildingName, type Building } from '@/lib/content/management/buildings'
import { SURVEY_LABEL, surveyTime, type Survey } from '@/lib/content/management/surveys'
import { setSurveyStatus } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'

const TONE: Record<Survey['status'], string> = {
  baru: 'text-plum',
  dikonfirmasi: 'text-available',
  selesai: 'text-ink-soft',
  batal: 'text-ink-soft',
}

/**
 * Today's viewings.
 *
 * The bundle's dashboard gives each row one button — "Konfirmasi" — which is
 * right for the row it drew and leaves nowhere to go afterwards. A confirmed
 * viewing still has to be marked done, and one that falls through has to be
 * cancelled with a reason, or the record stops matching the day.
 *
 * Cancelling asks why, for the same reason a price change does: it is the entry
 * somebody asks about a month later.
 */
export function SurveyList({
  surveys,
  buildings,
}: {
  surveys: Survey[]
  buildings: Building[]
}) {
  const { apply, actor } = useManagement()
  const { show } = useToast()
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const nameOf = (number: string) => {
    const b = buildings.find((x) => x.number === number)
    return b ? buildingName(b, buildings) : `Kostella ${number}`
  }

  const move = (survey: Survey, status: Survey['status'], note?: string) => {
    apply((s) => setSurveyStatus(s, survey, status, note))
    show({
      title: `Survei ${survey.name} — ${SURVEY_LABEL[status].toLowerCase()}`,
      detail: `${surveyTime(survey)} · ${nameOf(survey.building)} · tercatat atas ${actor}`,
      icon: status === 'batal' ? CalendarX : CalendarCheck,
      tone: status === 'batal' ? 'attention' : 'success',
      action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
    })
  }

  if (surveys.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-line px-5 py-8 text-center text-[14px] leading-[1.6] text-ink-soft">
        Tidak ada survei terjadwal hari ini. Permintaan baru dari halaman publik akan muncul di
        sini.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {surveys.map((survey) => {
        const done = survey.status === 'selesai' || survey.status === 'batal'

        return (
          <li
            key={survey.id}
            className={cn('rounded-card bg-paper p-4 shadow-card sm:p-5', done && 'opacity-70')}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-figure text-[17px] font-bold">{surveyTime(survey)}</span>
              <span className="text-[15px] font-semibold">{survey.name}</span>
              <span className={cn('text-[13px] font-semibold', TONE[survey.status])}>
                {SURVEY_LABEL[survey.status]}
              </span>
            </div>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Phone size={13} strokeWidth={1.9} aria-hidden />
                {survey.phone}
              </span>
              <span>
                {nameOf(survey.building)}
                {survey.room ? ` · kamar ${survey.room}` : ''}
              </span>
            </p>
            {survey.note && (
              <p className="mt-1 text-[13px] text-ink-soft">&ldquo;{survey.note}&rdquo;</p>
            )}

            {cancelling === survey.id ? (
              <form
                className="mt-3 flex flex-wrap items-end gap-2 rounded-card bg-canvas p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  move(survey, 'batal', reason.trim())
                  setCancelling(null)
                  setReason('')
                }}
              >
                <label className="min-w-0 flex-1 basis-52">
                  <span className="mb-1.5 block text-[13px] font-semibold">Alasan batal</span>
                  <input
                    autoFocus
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="mis. calon penyewa tidak datang"
                    className="w-full rounded-badge border border-line bg-paper px-3 py-2.5 text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
                  />
                </label>
                <div className="flex gap-2">
                  <Button size="sm" type="submit">
                    Simpan
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCancelling(null)}>
                    Kembali
                  </Button>
                </div>
              </form>
            ) : (
              !done && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {survey.status === 'baru' && (
                    <Button variant="secondary" size="sm" onClick={() => move(survey, 'dikonfirmasi')}>
                      <CalendarCheck size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                      Konfirmasi
                    </Button>
                  )}
                  {survey.status === 'dikonfirmasi' && (
                    <Button variant="secondary" size="sm" onClick={() => move(survey, 'selesai')}>
                      <Check size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                      Tandai selesai
                    </Button>
                  )}
                  <Button variant="warn" size="sm" onClick={() => setCancelling(survey.id)}>
                    <CalendarX size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                    Batalkan
                  </Button>
                </div>
              )
            )}
          </li>
        )
      })}
    </ul>
  )
}
