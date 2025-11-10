import type {Status} from "../enums/ApprenticeStatus"
import { getAge } from "../../plugins/get-age.plugin"

export default class Apprentice{
    readonly id: number
    readonly name: string
    readonly dateOfBirth: Date
    readonly age: number
    readonly trainingLv: number
    readonly status: Status | string

    constructor(attrs:{id:number,name:string,dateOfBirth:Date,age:number,trainingLv: number,status:Status})
    {
        this.id = attrs.id
        this.name = attrs.name
        this.dateOfBirth = attrs.dateOfBirth
        this.age = getAge(this.dateOfBirth)
        this.trainingLv = attrs.trainingLv
        this.status = attrs.status
    }

}

