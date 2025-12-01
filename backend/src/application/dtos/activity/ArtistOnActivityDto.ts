

export class ArtistOnActivityDto {

    constructor(public readonly activityId:number,
                public readonly apprenticeId:number,
                public readonly groupId:number,
                public readonly accepted?:boolean
    ){}

    static createToAdd (body:any):ArtistOnActivityDto{
           
            if(!body.activityId || !body.apprenticeId || !body.groupId || body.accepted==undefined){
                    throw new Error("Missing Properties")
            }
        return new ArtistOnActivityDto(body.activityId, body.apprenticeId,body.groupId,body.accepted)
    }

        static createToRemove (body:any):ArtistOnActivityDto{
           
            if(!body.activityId || !body.apprenticeId || !body.groupId){
                    throw new Error("Missing Properties")
            }
        return new ArtistOnActivityDto(body.activityId, body.apprenticeId,body.groupId)
    }
}