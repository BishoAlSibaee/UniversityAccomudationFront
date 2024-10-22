import { Room } from "./Room"

export class Suite {
  id: number
  number: number
  building_id: number
  floor_id: number
  rooms: Room[]

  constructor(id: number, number: number, building_id: number, floor_id: number, rooms: Room[]) {
    this.building_id = building_id
    this.id = id
    this.number = number
    this.floor_id = floor_id
    this.rooms = rooms
  }
}
