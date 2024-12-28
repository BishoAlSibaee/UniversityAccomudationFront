export class Facilitie {
  id: number;
  name_ar: string;
  name_en: string;
  building_id: number;
  floor_id: number;
  suite_id: number;
  room_types_id: number;
  lock_id: string;
  isChecked?: boolean;

  constructor(id: number, name_ar: string, name_en: string, building_id: number, floor_id: number, suite_id: number, room_types_id: number, lock_id: string, isChecked?: boolean) {
    this.id = id;
    this.name_ar = name_ar;
    this.name_en = name_en;
    this.building_id = building_id;
    this.floor_id = floor_id;
    this.suite_id = suite_id;
    this.room_types_id = room_types_id;
    this.lock_id = lock_id;
    this.isChecked = isChecked || false;
  }
}
