import { ArtistStatus } from "../../../domain/enums/ArtistStatus";


export class CreateArtistDto {
  
    constructor(
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string

   ) {}

  static Create(body: any): CreateArtistDto {
    
    if (!body.ArtistName || !body.DebutDate || !body.Status) {
      throw new Error('Missing required fields');
    }
    if (!( body.Status in ArtistStatus))
    {
        throw new Error('Invalid Status');
    }
    

    
    return new CreateArtistDto(body.ArtistName, body.DebutDate, body.Status);
  }
   
   
   

  
}