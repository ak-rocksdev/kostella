/**
 * Availability status, shared by every screen.
 *
 * The system forbids communicating status by colour alone, so anything
 * rendering one of these must also carry a word or a pattern.
 */
export type Status = 'available' | 'held' | 'occupied'
