/**
 * Where things actually are, in one place — every map in the product reads from
 * here so the buildings never drift between screens.
 *
 * Building coordinates come from the design bundle and sit on Jl. Dr. Susilo in
 * Grogol. Landmark coordinates are approximate real positions.
 *
 * CAUTION: the brief states "Central Park 0,2 km" from building 362, but the
 * mall is roughly 1,5 km away. On a schematic map that passed unnoticed; on a
 * real one it is visible. The stated distances need confirming with the owner —
 * the brand's own rule is that figures must be real and consistent.
 */
export const buildings = {
  '362': [-6.1636, 106.7884],
  '361': [-6.164, 106.7892],
  '360': [-6.1644, 106.7886],
  '351': [-6.1652, 106.7898],
  '2A3': [-6.1659, 106.788],
} as const satisfies Record<string, readonly [number, number]>

export const landmarks = {
  Trisakti: [-6.1683, 106.7889],
  Untar: [-6.1676, 106.7863],
  'Terminal Grogol': [-6.1618, 106.7893],
  'RS Royal Taruma': [-6.1655, 106.7845],
  'Central Park': [-6.1776, 106.7906],
} as const satisfies Record<string, readonly [number, number]>

/** Centre of the Jl. Dr. Susilo cluster. */
export const grogolCentre: [number, number] = [-6.1645, 106.789]

/** Ten minutes on foot, at a normal walking pace. */
export const walkingRadiusMetres = 800

type Coordinates = readonly [number, number]

const toMarker = (label: string, position: Coordinates, kind: 'building' | 'landmark') => ({
  label,
  position: [position[0], position[1]] as [number, number],
  kind,
})

export const buildingMarkers = (numbers: readonly string[]) =>
  numbers.map((number) => toMarker(number, buildings[number as keyof typeof buildings], 'building'))

export const landmarkMarkers = (names: readonly string[]) =>
  names.map((name) => toMarker(name, landmarks[name as keyof typeof landmarks], 'landmark'))
