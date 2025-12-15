import type { ArtistStatus } from "../enums/ArtistStatus";
import type { Group } from "./Group";


export class Artist{

    readonly ApprenticeId:number
    readonly GroupId:number
    readonly ArtistName:string
    readonly DebutDate:Date
    readonly Status:ArtistStatus
    readonly GroupHistory?:Group[] | undefined
    readonly realName?: string | undefined
    
    
     


    constructor(attrs:{ ApprenticeId:number, GroupId:number,ArtistName:string, DebutDate:Date, Status:ArtistStatus,GroupHistory?:Group[],realName?: string})
    {
        this.ApprenticeId=attrs.ApprenticeId
        this.GroupId=attrs.GroupId
        this.ArtistName=attrs.ArtistName
        this.DebutDate=attrs.DebutDate
        this.Status=attrs.Status
        this.GroupHistory=attrs.GroupHistory
        this.realName = attrs.realName
        
    }

 
}