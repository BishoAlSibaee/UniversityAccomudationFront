export class Floor {
    id:number
    number:number
    building_id:number

    constructor(id:number,number:number,building_id:number) {
        this.building_id = building_id
        this.id = id
        this.number = number
    }

}