
export class Reservation {
  id: number
  student_id: number
  room_id: number
  student_name: string
  room_number: string
  start_date: string
  expire_date: string
  start_time: string
  expire_time: string
  facility_ids: number[]
  is_available: number
  facility_name?: string[];


  constructor(id: number, student_id: number, room_id: number, student_name: string, room_number:
    string, start_date: string, expire_date: string, start_time: string, expire_time: string, facility_ids: number[] = [], is_available: number, facility_name?: string[]) {
    this.id = id
    this.student_id = student_id
    this.room_id = room_id
    this.student_name = student_name
    this.room_number = room_number
    this.start_date = start_date
    this.expire_date = expire_date
    this.start_time = start_time
    this.expire_time = expire_time
    this.facility_ids = facility_ids
    this.is_available = is_available
    this.facility_name = facility_name || []
  }
}
