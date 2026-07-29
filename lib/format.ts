/**
 * Rupiah with Indonesian dot separators.
 *
 * Two spacings are in use and both are deliberate: prices set inline in a room
 * list or card run tight (`Rp1.650.000`), while receipt lines get a space
 * (`Rp 1.650.000`) so the figures column aligns under the label column.
 */
export function formatRupiah(amount: number, { spaced = false } = {}): string {
  return `Rp${spaced ? ' ' : ''}${amount.toLocaleString('id-ID')}`
}
