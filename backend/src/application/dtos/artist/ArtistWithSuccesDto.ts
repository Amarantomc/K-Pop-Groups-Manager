
export class ArtistWithSuccesDto{
     readonly apprenticeId:number
     readonly groupId:number
     readonly albumId?:number |undefined
     readonly Title:number
     readonly soldCopiesCount?:number |undefined
     readonly releaseDate:Date
     readonly awardsCount?:number |undefined
     readonly songID?:number |undefined
     readonly gender?:number |undefined
     readonly producer?:number |undefined


     constructor(apprenticeId:number,groupId:number,releaseDate:Date,Title:number,albumId?:number,
            soldCopiesCount?:number,awardsCount?:number,
            songId?:number,gender?:number,producer?:number
     ){
         this.apprenticeId=apprenticeId
         this.groupId=groupId
         this.releaseDate=releaseDate
         this.albumId=albumId
         this.Title=Title
         this.soldCopiesCount=soldCopiesCount
         this.awardsCount=awardsCount
         this.songID=songId
         this.gender=gender
         this.producer=producer


     }

     static fromQueryResult(data:any):ArtistWithSuccesDto{
         return new ArtistWithSuccesDto(data.idAp,
            data.idGr,data.fechaLanzamiento,data.titulo,data.albumId,
            data.NoCopiasVendidas,data.numeroPremios,data.cancionId,data.genero,
            data.productor
         )
     }

     static fromQueryResultArray(data:any[]):ArtistWithSuccesDto[]{
        return data.map(album=>this.fromQueryResult(album))
     }
}