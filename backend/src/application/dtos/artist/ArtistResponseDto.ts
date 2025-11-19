import  { Artist } from "../../../domain/entities/Artist";
import { GroupMembership } from "../../../domain/value objects/GroupMembership";

export class ArtistResponseDto {
  constructor(
    public readonly id: number,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string,
    public readonly groupHistory?: Array<{
      groupId: number;
      role: string;
      startDate: string;
      endDate?: string;
    }>
    
  ) {}

  static fromEntity(artist: any): ArtistResponseDto {
    return new ArtistResponseDto(
      artist.id,
      artist.ArtistName,
      artist.DebutDate,
      artist.Status,
      artist.groupHistory
      
    );
  }

  static toEntity(artist:any):Artist {
    return new Artist({ 
      id:artist.id,
      ArtistName:artist.ArtistName,
      DebutDate: new Date(artist.DebutDate),
      Status:artist.Status,
      groupHistory: artist.HistorialGrupos?.map((h: any) => 
        new GroupMembership(
          h.idGr,
          h.rol,
          new Date(h.fechaInicio),
          h.fechaFinalizacion ? new Date(h.fechaFinalizacion) : undefined
        ))
      }
     
    )
  }

  static fromEntities(artists: any[]): ArtistResponseDto[] {
    return artists.map(artist => this.fromEntity(artist));
  }
}