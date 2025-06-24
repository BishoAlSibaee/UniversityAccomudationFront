export class OpeningRecord {
  id: number;
  room_id: number;
  room_number: number;
  user_id: number;
  user_name: string;
  created_at: string;

  constructor(
    id: number,
    room_id: number,
    room_number: number,
    user_id: number,
    user_name: string,
    created_at: string
  ) {
    this.id = id;
    this.room_id = room_id;
    this.room_number = room_number;
    this.user_id = user_id;
    this.user_name = user_name;
    this.created_at = created_at;
  }
}
