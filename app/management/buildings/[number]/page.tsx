import { BuildingDetail } from '@/components/management/BuildingDetail'
import { buildings } from '@/lib/content/management/buildings'

/**
 * A static export has no server to resolve a dynamic segment at request time,
 * so every building is prerendered. The list is a fact of the business, not
 * user input, which is what makes that possible.
 */
export function generateStaticParams() {
  return buildings.map((b) => ({ number: b.number }))
}

export default async function BuildingPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  return <BuildingDetail number={number} />
}
