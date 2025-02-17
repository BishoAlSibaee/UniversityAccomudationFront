export class Room {
  id: number
  number: number
  building_id: number
  floor_id: number
  suite_id: number
  capacity: number
  lock_data: string
  room_types_id: number

  constructor(id: number, building_id: number, floor_id: number, suite_id: number, number: number, capacity: number, lock_data: string, room_types_id: number) {
    this.id = id
    this.building_id = building_id
    this.floor_id = floor_id
    this.suite_id = suite_id
    this.number = number
    this.capacity = capacity
    this.lock_data = lock_data
    this.room_types_id = room_types_id
  }
}
