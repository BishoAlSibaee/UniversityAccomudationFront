import { Suite } from "./Suite"

export class Floor {
  id: number
  number: number
  building_id: number
  lock_id: string
  suites: Suite[]

  constructor(id: number, number: number, building_id: number, lock_id: string, suites: Suite[]) {
    this.building_id = building_id
    this.id = id
    this.number = number
    this.lock_id = lock_id
    this.suites = suites
  }
}
