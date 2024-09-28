export class Room {
    id:number
    number:number
    building_id:number
    floor_id:number
    suite_id:number

    constructor(id:number,number:number,building_id:number,floor_id:number,suite_id:number) {
        this.building_id = building_id
        this.id = id
        this.number = number
        this.floor_id = floor_id
        this.suite_id = suite_id
    }
}