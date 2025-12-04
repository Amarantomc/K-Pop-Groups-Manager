import type { ContractStatus } from "../enums/ContractStatus"

export default class Contract{
    readonly idAgency:number
    readonly apprenticeId:number
    readonly groupId:number
    readonly startDate:Date|string
    readonly completionDate ?:Date|string
    readonly incomeDistribution: string
    readonly status: ContractStatus | string
    readonly initialConditions:string

    constructor(attrs:{
        idAgency: number;
        apprenticeId:number,
        groupId:number,
        startDate: Date|string;
        completationDate: Date|string;
        incomeDistribution: string;
        status: string|ContractStatus;
        initialCondition:string
    })
    {
        this.idAgency = attrs.idAgency
        this.completionDate = attrs.completationDate
        this.apprenticeId = attrs.apprenticeId
        this.groupId = attrs.groupId
        this.incomeDistribution = attrs.incomeDistribution
        this.initialConditions = attrs.initialCondition
        this.startDate = attrs.startDate
        this.status = attrs.status
    }
}