/**
 * How a Kostella building is named, written once.
 *
 * The management records and the public pages both show building names, and
 * they must be the same string — a manager reading "Kostella Grogol 362" and a
 * renter reading "Jl. Dr. Susilo 2 No. 362" for the same building is the kind
 * of split that makes two screens look like two systems.
 *
 * The number is dropped where a district holds only one building, which is why
 * this takes `disambiguate` rather than deciding for itself: the two sides
 * count different sets. Management counts its own records; a public area counts
 * the properties in that area.
 *
 * CAUTION — this rule is not stable under growth. A lone "Kostella Setiabudi"
 * becomes "Kostella Setiabudi 18" the day a second Setiabudi building is added,
 * so a building's name can change because a *different* building appeared.
 * Signage, contracts and bookmarks would all be wrong. Raised with the client
 * on 2026-08-01; until they answer, the rule is left as designed rather than
 * changed unilaterally. See docs/management/ROADMAP.md > Open with the client.
 */
export function kostellaName(district: string, number: string, disambiguate: boolean): string {
  return disambiguate ? `Kostella ${district} ${number}` : `Kostella ${district}`
}
