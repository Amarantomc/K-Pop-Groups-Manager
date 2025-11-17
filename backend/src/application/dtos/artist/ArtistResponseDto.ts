import  { Artist } from "../../../domain/entities/Artist";

export class ArtistResponseDto {
  constructor(
    public readonly id: number,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly State: string,
    
  ) {}

  static fromEntity(artist: any): ArtistResponseDto {
    return new ArtistResponseDto(
      artist.id,
      artist.ArtistName,
      artist.DebutDate,
      artist.State
      
    );
  }

  static toEntity(artist:any):Artist {
    return new Artist({ 
      id:artist.id,
      ArtistName:artist.ArtistName,
      DebutDate: artist.DebutDate,
      State:artist.State,
      }
     
    )
  }

  static fromEntities(artists: any[]): ArtistResponseDto[] {
    return artists.map(artist => this.fromEntity(artist));
  }
}