
export class ArtistWithIncomeDto{
    readonly ApprenticeId:number
    readonly GroupId:number
     TotalIncome:number

    constructor(apprenticeId: number, groupId: number, totalIncome: number) {
      this.ApprenticeId=apprenticeId,
      this.GroupId=groupId,
      this.TotalIncome=totalIncome
    }

    static fromQueryResult(artist:any):ArtistWithIncomeDto{
        return new ArtistWithIncomeDto(artist.apprenticeId, artist.groupId, Number(artist.TotalIncome));
    }
}