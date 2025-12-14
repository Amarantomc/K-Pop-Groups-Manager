
export class RequestArtistWithIncomeDto{
    readonly apprenticeId:number
    readonly groupId:number
    readonly startDate:Date
    readonly endDate:Date
    constructor(apprenticeId:number,groupId:number,startDate:Date,endDate:Date){
        this.apprenticeId=apprenticeId
        this.groupId=groupId
        this.startDate=startDate
        this.endDate=endDate
    }

    static create(body:any):RequestArtistWithIncomeDto{
         if(!body.apprenticeId||!body.groupId||!body.startDate||!body.endDate){
            throw new Error("Missing Required fields")
         }
         return new RequestArtistWithIncomeDto(body.apprenticeId,body.groupId,new Date(body.startDate),new Date(body.endDate))
    }
}