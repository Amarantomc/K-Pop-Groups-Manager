import type { ArtistStatus } from "../enums/ArtistStatus";
import type { GroupMembership } from "../value objects/GroupMembership"

export class Artist{

    readonly id:number
    readonly ArtistName:string
    readonly DebutDate:Date
    readonly Status:ArtistStatus
    readonly groupHistory?: GroupMembership[];
     


    constructor(attrs:{ id:number,ArtistName:string, DebutDate:Date, Status:ArtistStatus, groupHistory?: GroupMembership[]})
    {
        this.id=attrs.id
        this.ArtistName=attrs.ArtistName
        this.DebutDate=attrs.DebutDate
        this.Status=attrs.Status
        if(attrs.groupHistory)
        {
            this.groupHistory = attrs.groupHistory;
        }
        
    }

      getCurrentGroup(): GroupMembership | undefined {
    return this.groupHistory?.find(m => m.isActive());
  }
}