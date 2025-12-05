
import type { ContractStatus } from "../enums/ContractStatus"
import type { ContractType } from "../enums/ContractType"
import type { Agency } from "./Agency"
import type { Artist } from "./Artist"
import type { Group } from "./Group"

export default class Contract{
    readonly agency:Agency
    readonly artist?:Artist | undefined
    readonly group?:Group | undefined
    readonly idGroupContract?:number | undefined
    readonly startDate:Date|string
    readonly completionDate ?:Date|string |undefined
    readonly incomeDistribution: string
    readonly status: ContractStatus | string
    readonly initialConditions:string
    readonly type:ContractType

    constructor(attrs:{
        agency: Agency;
        artist?: Artist | undefined;
        group?: Group | undefined;
        idGroupContract?: number | undefined;
        type: ContractType;
        startDate: Date|string;
        completationDate: Date|string| undefined;
        incomeDistribution: string;
        status: string|ContractStatus;
        initialCondition:string
    })
    {
        this.agency = attrs.agency
        this.completionDate = attrs.completationDate
        this.artist = attrs.artist
        this.group = attrs.group
        this.idGroupContract = attrs.idGroupContract
        this.type = attrs.type
        this.incomeDistribution = attrs.incomeDistribution
        this.initialConditions = attrs.initialCondition
        this.startDate = attrs.startDate
        this.status = attrs.status
    }
}