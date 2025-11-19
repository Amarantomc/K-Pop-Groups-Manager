import  { Artist } from "../../../domain/entities/Artist";

export class ArtistResponseDto {
  constructor(
    public readonly id: number,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string,
    
  ) {}

  static fromEntity(artist: any): ArtistResponseDto {
    return new ArtistResponseDto(
      artist.id,
      artist.ArtistName,
      artist.DebutDate,
      artist.Status
      
    );
  }

  static toEntity(artist:any):Artist {
    return new Artist({ 
      id:artist.id,
      ArtistName:artist.ArtistName,
      DebutDate: artist.DebutDate,
      Status:artist.Status,
      }
     
    )
  }

  static fromEntities(artists: any[]): ArtistResponseDto[] {
    return artists.map(artist => this.fromEntity(artist));
  }
}