import type { ContractStatus } from "../enums/contractStatus"

export default class Contract{
    readonly idAgency:number
    readonly idArtist:number
    readonly startDate:Date|string
    readonly completionDate ?:Date|string
    readonly incomeDistribution: string
    readonly status: ContractStatus | string
    readonly initialConditions:string

    constructor(attrs:{
        idAgency: number;
        idArtist: number;
        startDate: Date|string;
        completationDate: Date|string;
        incomeDistribution: string;
        status: string|ContractStatus;
        initialCondition:string
    })
    {
        this.idAgency = attrs.idAgency
        this.completionDate = attrs.completationDate
        this.idArtist = attrs.idArtist
        this.incomeDistribution = attrs.incomeDistribution
        this.initialConditions = attrs.initialCondition
        this.startDate = attrs.startDate
        this.status = attrs.status
    }
}