/**
 * What Kostella says about itself.
 *
 * CAUTION — none of this is counted by anything. It was read off the client's
 * current website while building the pitch, which makes it a snapshot of a
 * marketing page rather than a fact this system owns. It may already be out of
 * date, and nothing in this codebase will ever notice.
 *
 * It is legitimate on the public site, where a company states its own claims.
 * It must never appear in the management panel beside figures derived from the
 * records: there it reads as data, and a maintainer would wonder why it never
 * changes. See GUIDELINES > Figures.
 *
 * This is the only place these numbers are written. Confirm them with the
 * client before launch, and change them here.
 */
export const claimed = {
  buildings: 31,
  cities: 'Jakarta, Bandung, dan Bali',
  since: 2008,
  /** Flip to true once the client has confirmed the figures above. */
  confirmed: false,
} as const

/** "31 gedung di Jakarta, Bandung, dan Bali." */
export const scaleSentence = `${claimed.buildings} gedung di ${claimed.cities}.`

/** "Kos milik dan dikelola sendiri sejak 2008. 31 gedung di Jakarta, Bandung, dan Bali." */
export const positioningSentence = `Kos milik dan dikelola sendiri sejak ${claimed.since}. ${scaleSentence}`
