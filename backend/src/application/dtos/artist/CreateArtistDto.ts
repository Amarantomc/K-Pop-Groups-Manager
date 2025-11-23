import { ArtistStatus } from "../../../domain/enums/ArtistStatus";


export class CreateArtistDto {
  
    constructor(
    public readonly ApprenticeId: number,
    public readonly GroupId: number ,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string

   ) {}

  static Create(body: any): CreateArtistDto {
    
    if (!body.ArtistName || !body.DebutDate || !body.Status || !body.ApprenticeId || !body.GroupId) {
      throw new Error('Missing required fields');
    }
    if (!Object.values(ArtistStatus).includes(body.Status))
    {
        throw new Error('Invalid Status');
    }
    

     
    return new CreateArtistDto(body.ApprenticeId, body.GroupId, body.ArtistName, body.DebutDate, body.Status);
  }
   
   
   

  
}