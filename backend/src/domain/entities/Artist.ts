import type { ArtistStatus } from "../enums/ArtistStatus";

export class Artist{

    readonly id:number
    readonly ArtistName:string
    readonly DebutDate:Date
    readonly Status:ArtistStatus
     


    constructor(attrs:{ id:number,ArtistName:string, DebutDate:Date, Status:ArtistStatus})
    {
        this.id=attrs.id
        this.ArtistName=attrs.ArtistName
        this.DebutDate=attrs.DebutDate
        this.Status=attrs.Status
    }
}