import { ArtistState } from "../../../domain/enums/ArtistState";


export class CreateArtistDto {
  
    constructor(
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly State: string

   ) {}

  static Create(body: any): CreateArtistDto {
    
    if (!body.ArtistName || !body.DebutDate || !body.State) {
      throw new Error('Missing required fields');
    }
    if (!( body.State in ArtistState))
    {
        throw new Error('Invalid State');
    }
    

    
    return new CreateArtistDto(body.ArtistName, body.DebutDate, body.State);
  }
   
   
   

  
}