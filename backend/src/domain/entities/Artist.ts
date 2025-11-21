import type { ArtistStatus } from "../enums/ArtistStatus";


export class Artist{

    readonly ApprenticeId:number
    readonly GroupId:number

    readonly ArtistName:string
    readonly DebutDate:Date
    readonly Status:ArtistStatus
    
     


    constructor(attrs:{ ApprenticeId:number, GroupId:number,ArtistName:string, DebutDate:Date, Status:ArtistStatus})
    {
        this.ApprenticeId=attrs.ApprenticeId
        this.GroupId=attrs.GroupId
        this.ArtistName=attrs.ArtistName
        this.DebutDate=attrs.DebutDate
        this.Status=attrs.Status
 
        
    }

 
}