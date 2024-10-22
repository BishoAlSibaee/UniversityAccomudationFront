export class Room {
  id: number
  number: number
  building_id: number
  floor_id: number
  suite_id: number
  capacity: number
  lock_id: string
  type_room: string

  constructor(id: number, building_id: number, floor_id: number, suite_id: number, number: number, capacity: number, lock_id: string, type_room: string) {
    this.id = id
    this.building_id = building_id
    this.floor_id = floor_id
    this.suite_id = suite_id
    this.number = number
    this.capacity = capacity
    this.lock_id = lock_id
    this.type_room = type_room
  }
}
