/**
 * Viewings booked against a building.
 *
 * "Jadwalkan survei" is the most prominent call to action on the public site —
 * it appears in five places — so the record it would create is the one that
 * closes the loop between the two sides. The public button does not write here
 * yet; see the phase 2 spec for why that is named rather than assumed.
 *
 * EVERY RECORD BELOW IS INVENTED. Names are obviously fictional and numbers are
 * masked, because this repository is public and the bundle's own mockup carries
 * a full phone number verbatim. Kostella's real process — whether a viewing is
 * confirmed by phone, whether a no-show is tracked — is unknown, and the four
 * states here are my guess at it.
 */

import { addDays } from '@/lib/dates'

export type SurveyStatus = 'baru' | 'dikonfirmasi' | 'selesai' | 'batal'

export type Survey = {
  id: string
  building: string
  /** The room they asked about, where they named one. */
  room?: string
  /**
   * Days from whenever the panel is opened. 0 is today.
   *
   * An offset rather than a date, because this module must not read the clock.
   * It used to, and the value it produced was baked into the static HTML at
   * build time — so the day someone demonstrated the panel, the server's idea
   * of "today" and the browser's disagreed and React threw #418. See
   * `lib/management/today.ts`.
   */
  dayOffset: number
  /** Local hour and minute of the viewing. */
  hour: number
  minute?: number
  name: string
  /** Masked — see GUIDELINES > Personal data. */
  phone: string
  status: SurveyStatus
  note?: string
}

export const SURVEY_LABEL: Record<SurveyStatus, string> = {
  baru: 'Baru',
  dikonfirmasi: 'Dikonfirmasi',
  selesai: 'Selesai',
  batal: 'Batal',
}

/**
 * Seeded relative to whenever the panel is opened, so the dashboard always has
 * a today worth looking at. Fixed dates would leave the screen empty the day
 * after this was written, which is exactly when someone demonstrates it.
 */
export const surveys: Survey[] = [
  {
    id: 's1',
    building: '362',
    room: '211',
    dayOffset: 0,
    hour: 10,
    name: 'Calon penyewa A',
    phone: '0812 xxxx 7890',
    status: 'baru',
    note: 'Menanyakan kamar lantai 2',
  },
  {
    id: 's2',
    building: '362',
    dayOffset: 0,
    hour: 13,
    minute: 30,
    name: 'Orang tua calon penyewa B',
    phone: '0813 xxxx 5432',
    status: 'dikonfirmasi',
    note: 'Datang bersama anak',
  },
  {
    id: 's3',
    building: '351',
    room: '102',
    dayOffset: 0,
    hour: 16,
    name: 'Calon penyewa C',
    phone: '0857 xxxx 3344',
    status: 'baru',
  },
  {
    id: 's4',
    building: '360',
    dayOffset: 0,
    hour: 9,
    name: 'Calon penyewa D',
    phone: '0811 xxxx 2210',
    status: 'selesai',
    note: 'Sudah lihat, menimbang dulu',
  },
  // Not today. Present so narrowing and counting can be seen to exclude it.
  {
    id: 's5',
    building: '2A3',
    dayOffset: 2,
    hour: 11,
    name: 'Calon penyewa E',
    phone: '0878 xxxx 9001',
    status: 'dikonfirmasi',
  },
]

/** The calendar day a viewing falls on, given today. */
export const surveyDate = (survey: Survey, today: string) => addDays(today, survey.dayOffset)

/** Today's viewings, earliest first. Cancelled ones are still today's. */
export function surveysToday(all: Survey[]): Survey[] {
  return all.filter((s) => s.dayOffset === 0).sort((a, b) => order(a) - order(b))
}

const order = (s: Survey) => s.hour * 60 + (s.minute ?? 0)

/** "09.00" — the viewing's own local time, which needs no date at all. */
export const surveyTime = (survey: Survey) =>
  `${String(survey.hour).padStart(2, '0')}.${String(survey.minute ?? 0).padStart(2, '0')}`
