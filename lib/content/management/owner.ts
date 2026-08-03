/**
 * What an owner is allowed to know.
 *
 * A franchise partner put a building into Kostella's hands. They are entitled
 * to know how it performs; they are not entitled to know who lives in it. The
 * people in those rooms gave their names, their parents' numbers and their
 * occupations to Kostella, not to the owner.
 *
 * So this file returns **aggregates only**, and the owner screens read nothing
 * else. Not "filtered on the way out" — a filter is one careless prop away from
 * leaking. `ownerSummary` never returns a `Tenancy`, so there is nothing on the
 * page to leak: the floor grid it hands back carries a room number and a
 * status, and no occupant.
 *
 * The sharp case is arrears. "Rp 3.545.000 belum terbayar" tells an owner about
 * their own money. "Sari Handayani, kamar 304, terlambat 29 hari" hands a
 * tenant's financial difficulty to somebody with no standing to receive it, and
 * that tenant would never know it happened. So the figure crosses; the row does
 * not.
 */

import type { Status } from '../types'
import {
  buildingName,
  occupancy,
  monthlyBooked,
  monthlyPotential,
  type Building,
} from './buildings'
import { isCurrent, type Tenancy } from './tenancies'
import {
  monthOf,
  monthStart,
  powerMonth,
  rentCharge,
  rentPeriods,
  settle,
  type Charge,
  type Payment,
  type PlnBill,
} from './billing'
import { addMonths } from '@/lib/dates'

/** A room, as an owner may see it: which one, and whether it earns. */
export type OwnerRoom = {
  room: string
  floor: string
  status: Status
  blocked: boolean
}

export type OwnerSummary = {
  number: string
  name: string
  street: string
  district: string
  city: string

  rooms: { total: number; lettable: number; occupied: number; free: number; held: number }
  /** Occupied over lettable. */
  rate: number

  /** What the occupied rooms are contracted to pay, and what a full building
   *  would. Both from the agreed rents, not the asking prices. */
  income: { booked: number; potential: number }

  /** Everything tenants still owe, as one figure. Never a list. */
  outstanding: number

  /** How many rooms the manager is working on. A count, so it answers "is
   *  anyone doing anything" without naming anybody. */
  attention: number

  /** PLN billed on rooms with nobody in them last month. The owner's money
   *  leaving with nothing to recover it, and invisible today. */
  powerOnEmptyRooms: number
  powerMonth: string

  /** Rent and charges actually collected, by calendar month, oldest first. */
  trend: { month: string; amount: number }[]

  floors: { label: string; rooms: OwnerRoom[] }[]
}

export function ownerSummary(
  building: Building,
  all: Building[],
  tenancies: Tenancy[],
  billing: { bills: PlnBill[]; charges: Charge[]; payments: Payment[] },
  today: string,
  months = 6,
): OwnerSummary {
  const o = occupancy(building)
  const living = tenancies.filter((t) => t.building === building.number && isCurrent(t, today))

  /* Arrears, summed and then deliberately discarded down to a number. */
  let outstanding = 0
  for (const tenant of living) {
    for (const period of rentPeriods(tenant, today)) {
      outstanding += settle(rentCharge(tenant, period), billing.payments, today).outstanding
    }
    for (const charge of billing.charges.filter((c) => c.tenancy === tenant.id)) {
      outstanding += settle(charge, billing.payments, today).outstanding
    }
  }

  const lastMonth = monthOf(addMonths(monthStart(monthOf(today)), -1))
  let powerOnEmptyRooms = 0
  for (const room of building.rooms) {
    const power = powerMonth(
      building.number,
      room.room,
      lastMonth,
      billing.bills,
      billing.charges,
      billing.payments,
      tenancies,
      today,
    )
    if (power.bill && power.charges.length === 0 && !room.tenant) {
      powerOnEmptyRooms += power.bill.amount
    }
  }

  /* Collected per calendar month. Only this building's tenants count, which is
     why the charge ids are matched against their tenancy ids rather than the
     payments being summed wholesale. */
  const mine = new Set(tenancies.filter((t) => t.building === building.number).map((t) => t.id))
  const collected = new Map<string, number>()
  for (const payment of billing.payments) {
    const owner = [...mine].find((id) => payment.charge.includes(id))
    if (!owner) continue
    const key = monthOf(payment.paidOn)
    collected.set(key, (collected.get(key) ?? 0) + payment.amount)
  }

  const trend: { month: string; amount: number }[] = []
  for (let back = months; back >= 1; back -= 1) {
    const month = monthOf(addMonths(monthStart(monthOf(today)), -back))
    trend.push({ month, amount: collected.get(month) ?? 0 })
  }

  return {
    number: building.number,
    name: buildingName(building, all),
    street: building.street,
    district: building.district,
    city: building.city,

    rooms: {
      total: o.total,
      lettable: o.lettable,
      occupied: o.occupied,
      free: o.free,
      held: o.held,
    },
    rate: o.rate,
    income: { booked: monthlyBooked(building), potential: monthlyPotential(building) },
    outstanding,
    /* A blocked room and a room standing empty are both something the manager
       is dealing with. Naming which is not the owner's business. */
    attention: building.rooms.filter((r) => r.blocked).length + o.free,
    powerOnEmptyRooms,
    powerMonth: lastMonth,
    trend,

    floors: building.floors.map((label) => ({
      label,
      rooms: building.rooms
        .filter((r) => r.floor === label)
        .map((r) => ({
          room: r.room,
          floor: r.floor,
          status: r.status,
          blocked: Boolean(r.blocked),
        })),
    })),
  }
}
