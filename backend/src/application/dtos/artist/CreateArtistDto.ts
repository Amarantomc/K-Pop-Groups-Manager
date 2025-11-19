import { ArtistStatus } from "../../../domain/enums/ArtistStatus";


export class CreateArtistDto {
  
    constructor(
    public readonly apprenticeId: number,
    public readonly groupId: number ,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string

   ) {}

  static Create(body: any): CreateArtistDto {
    
    if (!body.ArtistName || !body.DebutDate || !body.Status || !body.apprenticeId || !body.groupId) {
      throw new Error('Missing required fields');
    }
    if (!( body.Status in ArtistStatus))
    {
        throw new Error('Invalid Status');
    }
    

    
    return new CreateArtistDto(body.apprenticeId, body.groupId, body.ArtistName, body.DebutDate, body.Status);
  }
   
   
   

  
}