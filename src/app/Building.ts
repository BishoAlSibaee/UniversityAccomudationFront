import { Floor } from "./Floor";

export class Building {
  id: number
  number: number
  name: string
  lock_id: string
  floors: Floor[];

  constructor(id: number, number: number, name: string, lock_id: string, floors: Floor[]) {
    this.id = id
    this.name = name
    this.number = number
    this.lock_id = lock_id
    this.floors = floors;
  }
}
