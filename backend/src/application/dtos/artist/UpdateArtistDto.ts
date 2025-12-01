import { ArtistStatus } from "../../../domain/enums/ArtistStatus";

export class UpdateArtistDto {
  
    constructor(
    
    public readonly ArtistName: string,
    public readonly DebutDate: Date,
    public readonly Status: string

   ) {}
     static Create(body: any): UpdateArtistDto {
    if (body.Status && !( body.Status in ArtistStatus)) {
      throw new Error("Invalid Status");
    }

    return new UpdateArtistDto(body.ArtistName, body.DebutDate, body.Status);
  }

  
}
