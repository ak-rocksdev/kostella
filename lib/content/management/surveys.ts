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

export type SurveyStatus = 'baru' | 'dikonfirmasi' | 'selesai' | 'batal'

export type Survey = {
  id: string
  building: string
  /** The room they asked about, where they named one. */
  room?: string
  /** ISO datetime, in Jakarta time. */
  at: string
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
 * a today worth looking at. A fixed date would leave the screen empty the day
 * after this was written, which is exactly when someone demonstrates it.
 */
function todayAt(hour: number, minute = 0): string {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function daysFromNow(days: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const surveys: Survey[] = [
  {
    id: 's1',
    building: '362',
    room: '211',
    at: todayAt(10, 0),
    name: 'Calon penyewa A',
    phone: '0812 xxxx 7890',
    status: 'baru',
    note: 'Menanyakan kamar lantai 2',
  },
  {
    id: 's2',
    building: '362',
    at: todayAt(13, 30),
    name: 'Orang tua calon penyewa B',
    phone: '0813 xxxx 5432',
    status: 'dikonfirmasi',
    note: 'Datang bersama anak',
  },
  {
    id: 's3',
    building: '351',
    room: '102',
    at: todayAt(16, 0),
    name: 'Calon penyewa C',
    phone: '0857 xxxx 3344',
    status: 'baru',
  },
  {
    id: 's4',
    building: '360',
    at: todayAt(9, 0),
    name: 'Calon penyewa D',
    phone: '0811 xxxx 2210',
    status: 'selesai',
    note: 'Sudah lihat, menimbang dulu',
  },
  // Not today. Present so narrowing and counting can be seen to exclude it.
  {
    id: 's5',
    building: '2A3',
    at: daysFromNow(2, 11),
    name: 'Calon penyewa E',
    phone: '0878 xxxx 9001',
    status: 'dikonfirmasi',
  },
]

const sameDay = (iso: string, day: Date) => {
  const d = new Date(iso)
  return (
    d.getFullYear() === day.getFullYear() &&
    d.getMonth() === day.getMonth() &&
    d.getDate() === day.getDate()
  )
}

/** Today's viewings, earliest first. Cancelled ones are still today's. */
export function surveysToday(all: Survey[], now = new Date()): Survey[] {
  return all
    .filter((s) => sameDay(s.at, now))
    .sort((a, b) => a.at.localeCompare(b.at))
}

export const surveyTime = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(iso))
