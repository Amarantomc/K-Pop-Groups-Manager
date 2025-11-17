import type { ArtistState } from "../enums/ArtistState";

export class Artist{

    readonly id:number
    readonly ArtistName:string
    readonly DebutDate:Date
    readonly State:ArtistState
     


    constructor(attrs:{ id:number,ArtistName:string, DebutDate:Date, State:ArtistState})
    {
        this.id=attrs.id
        this.ArtistName=attrs.ArtistName
        this.DebutDate=attrs.DebutDate
        this.State=attrs.State
    }
}